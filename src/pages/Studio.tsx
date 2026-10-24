import { Link } from "react-router-dom";
import { SectionHead } from "../components/Cards";
import { processSteps, services, site } from "../content/site";
import { organizationLd, useSeo } from "../lib/seo";

const Studio = () => {
  useSeo({ title: "스튜디오", description: site.intro, path: "/studio", jsonLd: organizationLd });

  return (
    <div className="page container">
      <header className="page-head">
        <p className="eyebrow">Studio</p>
        <h1 className="page-title">{site.brandKo}</h1>
        <p className="page-sub">{site.intro}</p>
      </header>

      <section className="section">
        <SectionHead title="하는 일" />
        <ol className="service-grid">
          {services.map((s, i) => (
            <li key={s.title} className="service">
              <span className="service-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="service-title">{s.titleKo}</h3>
              <p className="service-text">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <SectionHead title="진행 과정" sub="상담부터 완공 후 기록까지 다섯 단계로 진행합니다" />
        <ol className="steps">
          {processSteps.map((p, i) => (
            <li key={p.step} className="step">
              <span className="step-num">{i + 1}</span>
              <div>
                <h3 className="step-title">{p.title}</h3>
                <p className="step-text">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="cta">
          <h2 className="cta-title">함께 만들 공간 이야기를 들려주세요</h2>
          <Link to="/contact" className="btn">
            문의하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Studio;
