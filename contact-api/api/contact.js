// POST /api/contact — 사이트 문의를 Resend 로 내 메일함에 보낸다.
// 환경변수 (Vercel → Settings → Environment Variables, Production):
//   RESEND_API_KEY   Resend API 키 (필수, 비밀 값)
//   CONTACT_TO       받을 주소 (기본 namjh654@gmail.com. 도메인 인증 전에는 Resend 가입 이메일만 가능)
//   CONTACT_FROM     보내는 주소 (기본 "BONGBONG 문의 <onboarding@resend.dev>")
//   ALLOWED_ORIGINS  쉼표로 구분한 허용 출처 (기본 https://namjh654.github.io,http://localhost:3000)
import { buildEmail, validateInquiry } from "../lib/inquiry.js";

const origins = () =>
  (process.env.ALLOWED_ORIGINS || "https://namjh654.github.io,http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
});

const json = (status, data, origin) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...(origin ? cors(origin) : {}) },
  });

// 같은 인스턴스 안에서만 유지되는 간단한 연속 전송 제한 (IP 당 10분에 3건)
const recent = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const tooMany = (ip, now) => {
  const list = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  recent.set(ip, list);
  return list.length > 3;
};

export function OPTIONS(request) {
  const origin = request.headers.get("origin");
  if (!origins().includes(origin)) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: cors(origin) });
}

export async function POST(request) {
  const origin = request.headers.get("origin");
  if (!origins().includes(origin)) return json(403, { ok: false, error: "허용되지 않은 출처입니다." });

  const key = process.env.RESEND_API_KEY;
  if (!key) return json(503, { ok: false, error: "메일 설정이 아직 끝나지 않았습니다." }, origin);

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: "잘못된 요청입니다." }, origin);
  }

  const now = Date.now();
  const result = validateInquiry(body, now);
  if (!result.ok) {
    // 봇에는 성공처럼 답해 재시도를 유도하지 않는다
    if (result.spam) return json(200, { ok: true }, origin);
    return json(400, { ok: false, error: result.error }, origin);
  }

  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(ip, now)) return json(429, { ok: false, error: "잠시 후 다시 보내 주세요." }, origin);

  const email = buildEmail(result.value, {
    from: process.env.CONTACT_FROM || "BONGBONG 문의 <onboarding@resend.dev>",
    to: process.env.CONTACT_TO || "namjh654@gmail.com",
    site: origin,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(email),
  });

  if (!res.ok) {
    console.error("resend failed", res.status, await res.text().catch(() => ""));
    return json(502, { ok: false, error: "메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요." }, origin);
  }
  return json(200, { ok: true }, origin);
}
