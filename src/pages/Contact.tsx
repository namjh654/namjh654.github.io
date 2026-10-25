import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { site } from "../content/site";
import { formatBytes, toAttachment, type Attachment } from "../lib/image";
import { personLd, useSeo } from "../lib/seo";

const TOPICS = ["프로젝트 제안", "협업", "채용", "엄마의 밥상 서비스 문의", "기타"] as const;
const MAX_FILES = 5;
const MAX_TOTAL = 4 * 1024 * 1024;

type Status = "idle" | "sending" | "sent" | "error";

const Contact = () => {
  useSeo({
    title: "문의",
    description: "프로젝트 제안, 협업, 채용 문의를 남겨 주세요. 참고 이미지나 스크린샷도 함께 보낼 수 있습니다.",
    path: "/contact",
    jsonLd: personLd,
  });

  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("프로젝트 제안");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState(""); // 봇만 채우는 숨은 칸
  const [files, setFiles] = useState<Attachment[]>([]);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const startedAt = useRef(Date.now());
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "sent") window.scrollTo(0, 0);
  }, [status]);

  const total = files.reduce((s, f) => s + f.bytes, 0);

  const addFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    setError("");
    const room = MAX_FILES - files.length;
    if (room <= 0) return setError(`이미지는 ${MAX_FILES}장까지 첨부할 수 있습니다.`);
    try {
      const picked = Array.from(list).filter((f) => f.type.startsWith("image/")).slice(0, room);
      const added = await Promise.all(picked.map(toAttachment));
      const next = [...files, ...added.filter((a) => !files.some((p) => p.id === a.id))];
      if (next.reduce((s, f) => s + f.bytes, 0) > MAX_TOTAL)
        return setError("첨부 용량이 너무 큽니다. 이미지를 줄이거나 몇 장 빼 주세요.");
      setFiles(next);
      if (list.length > room) setError(`이미지는 ${MAX_FILES}장까지 첨부할 수 있습니다.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지를 첨부하지 못했습니다.");
    }
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`[문의] ${topic}`)}&body=${encodeURIComponent(message)}`;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!site.contactEndpoint) {
      setStatus("error");
      return setError("문의 양식이 아직 연결되지 않았습니다. 아래 메일 주소로 보내 주세요.");
    }
    setStatus("sending");
    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          name,
          email,
          company,
          message,
          agree,
          website,
          startedAt: startedAt.current,
          attachments: files.map(({ name, type, content }) => ({ name, type, content })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "보내지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "보내지 못했습니다.");
    }
  };

  if (status === "sent") {
    return (
      <section className="page container narrow">
        <div className="done">
          <span className="done-mark" aria-hidden>
            ✓
          </span>
          <h1 className="page-title">문의를 보냈습니다</h1>
          <p className="page-sub">내용을 확인한 뒤 남겨 주신 이메일로 연락드리겠습니다.</p>
          <div className="hero-actions">
            <Link to="/" className="btn">
              홈으로
            </Link>
            <Link to="/projects" className="btn btn-secondary">
              프로젝트 보기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const canSend = name.trim() && email.trim() && message.trim().length >= 10 && agree && status !== "sending";

  return (
    <section className="page container narrow">
      <header className="page-head">
        <p className="eyebrow">Contact</p>
        <h1 className="page-title">문의하기</h1>
        <p className="page-sub">
          프로젝트 제안, 협업, 채용 문의 모두 환영합니다. 참고 화면이나 스크린샷이 있다면 함께 첨부해 주세요.
        </p>
        <p className="page-sub">
          {site.studio}가 운영하는 <Link to="/projects/moms-table">엄마의 밥상</Link> 서비스 이용·개인정보 문의도 이곳에서
          받습니다.
        </p>
      </header>

      <form className="form" onSubmit={onSubmit} noValidate>
        <fieldset className="field">
          <legend className="field-label">문의 유형</legend>
          <div className="segment" role="radiogroup">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={topic === t}
                className={`segment-item${topic === t ? " is-active" : ""}`}
                onClick={() => setTopic(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="field-row">
          <label className="field">
            <span className="field-label">
              이름 <span className="req">*</span>
            </span>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} autoComplete="name" required />
          </label>
          <label className="field">
            <span className="field-label">
              답장 받을 이메일 <span className="req">*</span>
            </span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
              autoComplete="email"
              required
            />
          </label>
        </div>

        <label className="field">
          <span className="field-label">회사 · 소속 (선택)</span>
          <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={100} autoComplete="organization" />
        </label>

        <label className="field">
          <span className="field-label">
            내용 <span className="req">*</span>
          </span>
          <textarea
            className="input textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={5000}
            rows={8}
            placeholder="어떤 일인지, 일정과 예산, 참고할 링크가 있다면 함께 적어 주세요."
            required
          />
          <span className="field-hint">{message.length.toLocaleString()} / 5,000</span>
        </label>

        <div className="field">
          <span className="field-label">이미지 첨부 (선택)</span>
          <div
            className={`dropzone${dragging ? " is-over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <p>
              스크린샷이나 참고 이미지를 끌어다 놓거나{" "}
              <button type="button" className="link-button" onClick={() => fileInput.current?.click()}>
                파일 선택
              </button>
            </p>
            <p className="field-hint">JPG·PNG·WEBP · 최대 {MAX_FILES}장 · 큰 사진은 자동으로 줄여서 보냅니다</p>
            <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={onPick} />
          </div>
          {files.length > 0 && (
            <ul className="thumbs">
              {files.map((f) => (
                <li key={f.id} className="thumb">
                  <img src={f.preview} alt={f.name} />
                  <button
                    type="button"
                    className="thumb-remove"
                    aria-label={`${f.name} 빼기`}
                    onClick={() => setFiles((prev) => prev.filter((p) => p.id !== f.id))}
                  >
                    ×
                  </button>
                </li>
              ))}
              <li className="thumb-total">
                {files.length}장 · {formatBytes(total)}
              </li>
            </ul>
          )}
        </div>

        <label className="hp" aria-hidden="true">
          웹사이트
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>

        <label className="check">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            답장을 위해 이름·이메일·문의 내용을 수집하는 데 동의합니다. 수집한 정보는 답장과 상담에만 쓰고, 상담이 끝나면 지웁니다.
          </span>
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}{" "}
            {status === "error" && (
              <a href={mailto} className="text-link">
                메일로 보내기
              </a>
            )}
          </p>
        )}

        <button type="submit" className="btn btn-block" disabled={!canSend}>
          {status === "sending" ? "보내는 중…" : "문의 보내기"}
        </button>
        <p className="field-hint form-alt">
          메일이 편하시면 <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </form>
    </section>
  );
};

export default Contact;
