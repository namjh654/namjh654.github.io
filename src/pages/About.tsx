import { Link } from "react-router-dom";
import { SectionHead, Tags } from "../components/Cards";
import { companies } from "../content";
import { site, skills } from "../content/site";
import { personLd, useSeo } from "../lib/seo";

const About = () => {
  useSeo({ title: "소개", description: site.intro, path: "/about", jsonLd: personLd });

  return (
    <div className="page container">
      <header className="page-head">
        <p className="eyebrow">About</p>
        <h1 className="page-title">{site.brandKo}</h1>
        <p className="page-sub">{site.intro}</p>
        <p className="page-sub">
          직접 만든 서비스는 {site.studio}라는 이름으로 운영합니다. 지금은{" "}
          <Link to="/projects/moms-table">엄마의 밥상</Link>을 무료로 운영하고 있습니다(상업화 전).
        </p>
      </header>

      <section className="section section-tight">
        <SectionHead title="일하는 방식" />
        <ol className="service-grid">
          {[
            ["기획부터 운영까지", "아이디어를 화면과 데이터 구조로 옮기고, 배포한 뒤 운영 도구까지 직접 만듭니다."],
            ["보안은 서버에서", "화면에서 숨기는 것으로 끝내지 않고, 데이터 접근은 DB 권한(RLS)과 서버 검증으로 막습니다."],
            ["다시 쓰는 구조", "관리자·KMP 템플릿처럼 반복되는 일을 도구로 만들어 다음 프로젝트를 빠르게 시작합니다."],
            ["검증하고 배포", "타입·린트·테스트·E2E 를 CI 에 두고, 작업 브랜치 → dev → 운영 순서로 배포합니다."],
          ].map(([t, b], i) => (
            <li key={t} className="service">
              <span className="service-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="service-title">{t}</h3>
              <p className="service-text">{b}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <SectionHead title="기술 스택" />
        <div className="spec">
          {skills.map((s) => (
            <div key={s.area} className="spec-row">
              <span className="spec-key">{s.area}</span>
              <Tags items={s.items} />
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHead title="경력" />
        <div className="spec">
          {companies.map((c) => (
            <div key={c.key} className="spec-row">
              <span className="spec-key">{c.name}</span>
              <span className="spec-value">
                {[c.period, c.role, c.projects.map((p) => p.name).join(" · ")].filter(Boolean).join("  |  ")}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta">
          <h2 className="cta-title">연락하기</h2>
          <p className="cta-sub">프로젝트 제안, 협업, 채용 문의 모두 환영합니다.</p>
          <div className="hero-actions">
            <Link to="/contact" className="btn">
              문의하기
            </Link>
            <a href={site.github} className="btn btn-secondary" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
