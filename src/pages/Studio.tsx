import { Link } from "react-router-dom";
import { SectionHead, delay } from "../components/Cards";
import { processSteps, services, site } from "../content/site";
import { organizationLd, useSeo } from "../lib/seo";
import studioPhoto from "../assets/photos/studio.jpg";

const Studio = () => {
  useSeo({
    title: "스튜디오",
    description: site.intro,
    path: "/studio",
    image: studioPhoto,
    jsonLd: organizationLd,
  });

  return (
    <div className="page">
      <section className="hero hero-short">
        <img className="hero-photo" src={studioPhoto} alt="" />
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="hero-label">Studio</p>
          <h1 className="hero-title">{site.brandKo}</h1>
        </div>
      </section>

      <section className="section container statement">
        <p className="statement-text" data-reveal>
          {site.intro}
        </p>
      </section>

      <section className="section section-gray">
        <div className="container">
          <SectionHead label="Services" title="하는 일" />
          <ol className="service-grid">
            {services.map((s, i) => (
              <li key={s.title} className="service" data-reveal style={delay(i)}>
                <span className="service-num">0{i + 1}</span>
                <h3 className="service-title">{s.titleKo}</h3>
                <p className="muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section container">
        <SectionHead label="Process" title="진행 과정" />
        <ol className="process">
          {processSteps.map((p) => (
            <li key={p.step} className="process-item" data-reveal>
              <span className="process-step">{p.step}</span>
              <h3 className="process-title">{p.title}</h3>
              <p className="muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section container closing" data-reveal>
        <h2 className="section-title">함께 만들 공간 이야기를 들려주세요.</h2>
        <Link to="/contact" className="btn">
          문의하기
        </Link>
      </section>
    </div>
  );
};

export default Studio;
