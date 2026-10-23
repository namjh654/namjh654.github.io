import { Link } from "react-router-dom";
import { projects } from "../content";
import { processSteps, services, site } from "../content/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const Studio = () => {
  useDocumentTitle("Studio");
  const years = new Date().getFullYear() - site.since + 1;

  return (
    <div className="page">
      <section className="container page-head">
        <p className="eyebrow">Studio</p>
        <h1 className="page-title">{site.brandKo}</h1>
        <p className="lead page-lead">{site.intro}</p>
      </section>

      <section className="band band-gray">
        <div className="container split">
          <div className="split-head">
            <h2 className="section-title">하는 일</h2>
            <p className="muted">설계, 시공, 브랜딩을 한 팀이 끝까지 맡습니다.</p>
          </div>
          <div className="bento">
            <div className="bento-card bento-lime bento-stat">
              <span className="pill pill-dark">#완성한 프로젝트</span>
              <strong>{projects.length}+</strong>
            </div>
            <div className="bento-card bento-blue bento-stat">
              <span className="pill">#함께한 시간</span>
              <strong>{years}년</strong>
            </div>
            {services.map((s) => (
              <div key={s.title} className="bento-card">
                <p className="bento-en">{s.title}</p>
                <h3 className="bento-title">{s.titleKo}</h3>
                <p className="muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">진행 과정</h2>
        <ol className="process">
          {processSteps.map((p) => (
            <li key={p.step} className="process-item">
              <span className="process-step">{p.step}</span>
              <div>
                <h3 className="process-title">{p.title}</h3>
                <p className="muted">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="band band-lime">
        <div className="container cta-inner">
          <h2 className="band-title">함께 만들 공간 이야기를 들려주세요.</h2>
          <Link to="/contact" className="button">
            문의하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Studio;
