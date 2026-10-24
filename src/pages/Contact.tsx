import { categories, site } from "../content/site";
import { organizationLd, useSeo } from "../lib/seo";

const mailBody = [
  "공간 유형: (주거 / 상업 / 리모델링 / 브랜딩)",
  "위치:",
  "면적:",
  "예산:",
  "희망 일정:",
  "문의 내용:",
].join("\n");

const Contact = () => {
  useSeo({
    title: "문의",
    description: `${site.brandKo} 프로젝트 상담 문의. ${Object.values(categories).join("·")} 공간 설계와 시공.`,
    path: "/contact",
    jsonLd: organizationLd,
  });
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `[${site.brandKo}] 프로젝트 문의`
  )}&body=${encodeURIComponent(mailBody)}`;

  const rows = [
    ["이메일", site.email, mailto],
    ["전화", site.phone, site.phone && `tel:${site.phone}`],
    ["인스타그램", site.instagram && "Instagram", site.instagram],
    ["스튜디오", site.address, ""],
    ["분야", Object.values(categories).join(" · "), ""],
  ].filter(([, v]) => v);

  return (
    <section className="page container narrow">
      <header className="page-head">
        <p className="eyebrow">Contact</p>
        <h1 className="page-title">
          어떤 공간을
          <br />
          준비하고 계신가요?
        </h1>
        <p className="page-sub">
          공간 유형과 위치, 면적, 예산, 일정을 함께 알려주시면 더 정확하게 안내드릴 수 있습니다.
        </p>
        <div className="hero-actions">
          <a href={mailto} className="btn">
            메일로 문의하기
          </a>
        </div>
      </header>

      <dl className="info-card">
        {rows.map(([k, v, href]) => (
          <div key={k} className="info-row">
            <dt>{k}</dt>
            <dd>
              {href ? (
                <a href={href} {...(href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}>
                  {v}
                </a>
              ) : (
                v
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default Contact;
