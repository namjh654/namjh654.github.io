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
            ["출시하고 운영하는 앱", "개발에서 끝내지 않고 Google Play·App Store 심사와 배포, 강제 업데이트, 개발·운영 환경 분리까지 맡아 왔습니다."],
            ["크로스플랫폼과 네이티브", "React Native·Expo 로 두 플랫폼을 함께 만들고, 기기 연동처럼 네이티브가 필요한 곳은 Android Kotlin 으로 직접 다룹니다."],
            ["기기·현장과 이어지는 앱", "BLE 웨어러블 밴드 연결과 생체 데이터 그래프, 승강기 관제·현장 대응처럼 실제 장비와 사람에 닿는 앱을 만듭니다."],
            ["구조를 고쳐 오래 쓰게", "RN CLI 프로젝트를 Expo 로 옮기고 구조를 정리하는 등, 다음 사람이 이어받기 쉬운 코드로 바꿉니다. 회사 밖에서는 직접 만든 서비스를 운영합니다."],
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
