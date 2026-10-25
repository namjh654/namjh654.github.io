// 문의 입력 검증과 메일 본문 만들기. 네트워크·환경변수에 의존하지 않아 테스트하기 쉽게 분리했다.

export const TOPICS = ["프로젝트 제안", "협업", "채용", "엄마의 밥상 서비스 문의", "기타"];
export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 1.5 * 1024 * 1024; // 브라우저에서 줄인 뒤 기준
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // Vercel 요청 한도(4.5MB) 안쪽
export const MIN_FILL_MS = 3000; // 이보다 빨리 제출되면 봇으로 본다
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v) => (typeof v === "string" ? v.trim() : "");

/** base64 문자열의 실제 바이트 수 */
export const base64Bytes = (b64) => {
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - pad;
};

/**
 * 요청 본문을 검사한다.
 * @returns {{ ok: true, value: object } | { ok: false, error: string, spam?: boolean }}
 */
export function validateInquiry(body, now = Date.now()) {
  if (!body || typeof body !== "object") return { ok: false, error: "잘못된 요청입니다." };

  // 봇 차단: 숨은 칸이 채워졌거나 너무 빨리 제출됨 → 성공처럼 응답하고 보내지 않는다
  if (str(body.website)) return { ok: false, spam: true, error: "spam" };
  const startedAt = Number(body.startedAt);
  if (!startedAt || now - startedAt < MIN_FILL_MS) return { ok: false, spam: true, error: "spam" };

  const topic = str(body.topic);
  const name = str(body.name);
  const email = str(body.email);
  const company = str(body.company);
  const message = str(body.message);

  if (!TOPICS.includes(topic)) return { ok: false, error: "문의 유형을 골라 주세요." };
  if (!name || name.length > 50) return { ok: false, error: "이름을 50자 이내로 적어 주세요." };
  if (!EMAIL_RE.test(email) || email.length > 254) return { ok: false, error: "답장 받을 이메일을 확인해 주세요." };
  if (company.length > 100) return { ok: false, error: "회사·소속은 100자 이내로 적어 주세요." };
  if (message.length < 10 || message.length > 5000)
    return { ok: false, error: "내용은 10자 이상 5,000자 이하로 적어 주세요." };
  if (body.agree !== true) return { ok: false, error: "개인정보 수집·이용에 동의해 주세요." };

  const files = Array.isArray(body.attachments) ? body.attachments : [];
  if (files.length > MAX_FILES) return { ok: false, error: `이미지는 ${MAX_FILES}장까지 첨부할 수 있습니다.` };

  let total = 0;
  const attachments = [];
  for (const [i, f] of files.entries()) {
    const type = str(f?.type);
    const content = str(f?.content);
    if (!IMAGE_TYPES.includes(type) || !/^[A-Za-z0-9+/]+=*$/.test(content))
      return { ok: false, error: "JPG·PNG·WEBP 이미지만 첨부할 수 있습니다." };
    const bytes = base64Bytes(content);
    if (bytes > MAX_FILE_BYTES) return { ok: false, error: "이미지 한 장이 너무 큽니다." };
    total += bytes;
    const ext = type.split("/")[1].replace("jpeg", "jpg");
    const base = str(f?.name).replace(/\.[^.]+$/, "").replace(/[^\w가-힣-]+/g, "_").slice(0, 40) || "image";
    attachments.push({ filename: `${String(i + 1).padStart(2, "0")}-${base}.${ext}`, content });
  }
  if (total > MAX_TOTAL_BYTES) return { ok: false, error: "첨부 이미지 용량이 너무 큽니다." };

  return { ok: true, value: { topic, name, email, company, message, attachments } };
}

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Resend 로 보낼 메일 */
export function buildEmail(v, { from, to, site }) {
  const rows = [
    ["유형", v.topic],
    ["이름", v.name],
    ["이메일", v.email],
    ["회사·소속", v.company || "-"],
    ["첨부", v.attachments.length ? `${v.attachments.length}장` : "없음"],
  ];
  const html = `<div style="font-family:-apple-system,'Apple SD Gothic Neo',sans-serif;max-width:640px;color:#191f28">
<h2 style="margin:0 0 16px">새 문의 · ${escapeHtml(v.topic)}</h2>
<table style="border-collapse:collapse;width:100%;font-size:14px">${rows
    .map(
      ([k, val]) =>
        `<tr><td style="padding:8px 12px;background:#f2f4f6;width:96px;color:#6b7684">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e8eb">${escapeHtml(val)}</td></tr>`
    )
    .join("")}</table>
<p style="white-space:pre-wrap;line-height:1.7;margin:24px 0;font-size:15px">${escapeHtml(v.message)}</p>
<p style="font-size:12px;color:#8b95a1">${escapeHtml(site)} 문의 페이지에서 보냄 · 답장하면 문의자(${escapeHtml(v.email)})에게 갑니다.</p>
</div>`;
  const text = `${rows.map(([k, val]) => `${k}: ${val}`).join("\n")}\n\n${v.message}`;

  return {
    from,
    to: [to],
    reply_to: v.email,
    subject: `[문의] ${v.topic} · ${v.name}`,
    html,
    text,
    attachments: v.attachments,
  };
}
