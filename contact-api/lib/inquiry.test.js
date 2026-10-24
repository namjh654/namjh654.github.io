import assert from "node:assert/strict";
import test from "node:test";
import { MAX_FILES, buildEmail, validateInquiry } from "./inquiry.js";

const now = 1_000_000;
const valid = {
  topic: "협업",
  name: "홍길동",
  email: "hong@example.com",
  company: "",
  message: "사이트를 보고 연락드립니다. 협업 제안입니다.",
  agree: true,
  website: "",
  startedAt: now - 10_000,
  attachments: [],
};

test("정상 입력은 통과한다", () => {
  const r = validateInquiry(valid, now);
  assert.equal(r.ok, true);
  assert.equal(r.value.name, "홍길동");
});

test("숨은 칸이 채워지거나 너무 빨리 제출되면 스팸", () => {
  assert.equal(validateInquiry({ ...valid, website: "http://spam" }, now).spam, true);
  assert.equal(validateInquiry({ ...valid, startedAt: now - 500 }, now).spam, true);
});

test("필수 항목과 형식을 검사한다", () => {
  assert.equal(validateInquiry({ ...valid, topic: "광고" }, now).ok, false);
  assert.equal(validateInquiry({ ...valid, email: "nope" }, now).ok, false);
  assert.equal(validateInquiry({ ...valid, message: "짧음" }, now).ok, false);
  assert.equal(validateInquiry({ ...valid, agree: false }, now).ok, false);
});

test("첨부는 이미지 형식·개수·크기를 제한한다", () => {
  const img = { name: "screen shot.png", type: "image/png", content: "aGVsbG8=" };
  const ok = validateInquiry({ ...valid, attachments: [img] }, now);
  assert.equal(ok.ok, true);
  assert.equal(ok.value.attachments[0].filename, "01-screen_shot.png");

  assert.equal(validateInquiry({ ...valid, attachments: [{ ...img, type: "application/pdf" }] }, now).ok, false);
  assert.equal(validateInquiry({ ...valid, attachments: Array(MAX_FILES + 1).fill(img) }, now).ok, false);
  const huge = { ...img, content: "A".repeat(3 * 1024 * 1024) };
  assert.equal(validateInquiry({ ...valid, attachments: [huge] }, now).ok, false);
});

test("메일 본문은 HTML 을 이스케이프하고 답장 주소를 문의자로 둔다", () => {
  const { value } = validateInquiry({ ...valid, name: "<b>해커</b>" }, now);
  const mail = buildEmail(value, { from: "a@b.c", to: "me@x.y", site: "https://s" });
  assert.equal(mail.reply_to, "hong@example.com");
  assert.ok(mail.html.includes("&lt;b&gt;해커&lt;/b&gt;"));
  assert.ok(!mail.html.includes("<b>해커"));
});
