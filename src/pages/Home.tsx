import { Link } from "react-router-dom";
import { BehindRow, ProjectCard, SectionHead } from "../components/Cards";
import { behindPosts, featuredProjects, projects } from "../content";
import { categories, services, site } from "../content/site";
import { organizationLd, useSeo } from "../lib/seo";

const Home = () => {
  const years = new Date().getFullYear() - site.since + 1;
  useSeo({ path: "/", jsonLd: organizationLd });

  return (
    <>
      <section className="hero container">
        <p className="eyebrow">{site.brandKo}</p>
        <h1 className="hero-title">{site.tagline}</h1>
        <p className="hero-sub">{site.intro}</p>
        <div className="hero-actions">
          <Link to="/projects" className="btn">
            프로젝트 보기
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            상담 문의
          </Link>
        </div>
      </section>

      <section className="container">
        <dl className="stats">
          <div className="stat">
            <dt>완성한 프로젝트</dt>
            <dd>{projects.length}건</dd>
          </div>
          <div className="stat">
            <dt>함께한 시간</dt>
            <dd>{years}년</dd>
          </div>
          <div className="stat">
            <dt>작업 분야</dt>
            <dd>{Object.keys(categories).length}개</dd>
          </div>
        </dl>
      </section>

      <section className="section container">
        <SectionHead
          title="최근 프로젝트"
          sub="설계부터 완공까지 함께한 공간"
          link={{ to: "/projects", text: "전체 보기" }}
        />
        <div className="card-grid">
          {featuredProjects().map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="section container">
        <SectionHead title="하는 일" sub="한 팀이 처음 상담부터 완공 후 기록까지 맡습니다" />
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

      {behindPosts.length > 0 && (
        <section className="section container">
          <SectionHead
            title="비하인드"
            sub="결과물 뒤에 있는 과정과 고민"
            link={{ to: "/behind", text: "전체 보기" }}
          />
          <ul className="rows">
            {behindPosts.slice(0, 3).map((post) => (
              <BehindRow key={post.slug} post={post} />
            ))}
          </ul>
        </section>
      )}

      <section className="section section-last container">
        <div className="cta">
          <h2 className="cta-title">새 공간을 준비하고 계신가요?</h2>
          <p className="cta-sub">위치와 면적, 예산, 일정을 알려주시면 방향을 함께 잡아드립니다.</p>
          <Link to="/contact" className="btn">
            프로젝트 문의하기
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
