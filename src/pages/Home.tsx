import { Link } from "react-router-dom";
import { ProjectMasonry } from "../components/Cards";
import { behindPosts, featuredProjects, projects } from "../content";
import { services, site } from "../content/site";
import { formatDate, useDocumentTitle } from "../lib/useDocumentTitle";

const Home = () => {
  useDocumentTitle();
  const [hero, ...rest] = featuredProjects();
  const works = rest.length ? rest : hero ? [hero] : [];
  const [behindMain, behindSub] = behindPosts;
  const years = new Date().getFullYear() - site.since + 1;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="hero-title">{site.tagline}</h1>
          <p className="hero-intro">{site.intro}</p>
          <Link to="/projects" className="button">
            프로젝트 보러가기
          </Link>
          {hero && (
            <Link to={`/projects/${hero.slug}`} className="hero-visual">
              <img src={hero.cover} alt={hero.title} />
              <span className="tag">{hero.title}</span>
            </Link>
          )}
        </div>
      </section>

      <section className="section container split">
        <aside className="intro-card">
          <h2 className="intro-title">
            새로 올라온
            <br />
            프로젝트
          </h2>
          <p>
            설계부터 완공까지, 스튜디오가 만든 공간을 프로젝트 단위로 기록합니다.
          </p>
          <Link to="/projects" className="button button-outline">
            프로젝트 더 보기
          </Link>
        </aside>
        <ProjectMasonry list={works} />
      </section>

      {behindMain && (
        <section className="band band-blue">
          <div className="container band-inner">
            <Link to={`/behind/${behindMain.slug}`} className="overlay-card band-main">
              <img src={behindMain.cover} alt="" loading="lazy" />
              <span className="overlay-top">{formatDate(behindMain.date)}</span>
              <span className="overlay-title">{behindMain.title}</span>
            </Link>
            {behindSub && (
              <Link to={`/behind/${behindSub.slug}`} className="overlay-card band-sub">
                <img src={behindSub.cover} alt="" loading="lazy" />
                <span className="overlay-title">{behindSub.title}</span>
              </Link>
            )}
            <div className="band-text">
              <h2 className="band-title">
                결과물 뒤에 있는
                <br />
                작업 비하인드
              </h2>
              <p>현장에서 생긴 일, 재료를 고르는 과정, 브랜드를 만드는 고민을 나눕니다.</p>
              <Link to="/behind" className="button button-outline">
                비하인드 보러가기
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="band band-gray">
        <div className="container split">
          <div className="split-head">
            <h2 className="section-title">스튜디오 보고서</h2>
            <p className="muted">
              {site.since}년부터 공간 설계와 리모델링, 브랜딩을 함께 해왔습니다.
            </p>
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

      <section className="band band-lime">
        <div className="container cta-inner">
          <h2 className="band-title">새 공간을 준비하고 계신가요?</h2>
          <Link to="/contact" className="button">
            프로젝트 문의하기
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
