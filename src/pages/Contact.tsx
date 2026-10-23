import { categories, site } from "../content/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const mailBody = [
  "공간 유형: (주거 / 상업 / 리모델링 / 브랜딩)",
  "위치:",
  "면적:",
  "예산:",
  "희망 일정:",
  "문의 내용:",
].join("\n");

const Contact = () => {
  useDocumentTitle("Contact");
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `[${site.brandKo}] 프로젝트 문의`
  )}&body=${encodeURIComponent(mailBody)}`;

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Contact</p>
        <h1 className="page-title">프로젝트 문의</h1>
        <p className="muted page-lead">
          공간 유형과 위치, 면적, 예산, 일정을 함께 알려주시면 더 정확하게 안내드릴 수
          있습니다.
        </p>
      </header>

      <div className="contact-grid">
        <div className="contact-item">
          <p className="eyebrow">Email</p>
          <a href={mailto} className="contact-value">
            {site.email}
          </a>
        </div>
        {site.phone && (
          <div className="contact-item">
            <p className="eyebrow">Phone</p>
            <a href={`tel:${site.phone}`} className="contact-value">
              {site.phone}
            </a>
          </div>
        )}
        {site.instagram && (
          <div className="contact-item">
            <p className="eyebrow">Instagram</p>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="contact-value">
              Instagram ↗
            </a>
          </div>
        )}
        <div className="contact-item">
          <p className="eyebrow">Studio</p>
          <p className="contact-value">{site.address}</p>
        </div>
        <div className="contact-item">
          <p className="eyebrow">Fields</p>
          <p className="contact-value">{Object.values(categories).join(" · ")}</p>
        </div>
      </div>

      <a href={mailto} className="button contact-cta">
        메일로 문의하기
      </a>
    </section>
  );
};

export default Contact;
