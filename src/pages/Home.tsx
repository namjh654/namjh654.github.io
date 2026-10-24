import { Link } from "react-router-dom";
import { PostRow, ProjectCard, SectionHead, Tags } from "../components/Cards";
import { companies, featuredProjects, games, posts, workProjects } from "../content";
import { site } from "../content/site";
import { personLd, useSeo } from "../lib/seo";

const Home = () => {
  useSeo({ path: "/", jsonLd: personLd });

  return (
    <>
      <section className="hero container">
        <p className="eyebrow">{site.brandKo} · Developer</p>
        <h1 className="hero-title">{site.tagline}</h1>
        <p className="hero-sub">{site.intro}</p>
        <div className="hero-actions">
          <Link to="/projects" className="btn">
            프로젝트 보기
          </Link>
          <a href={site.github} className="btn btn-secondary" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
      </section>

      <section className="container">
        <dl className="stats">
          <div className="stat">
            <dt>개인 서비스·템플릿</dt>
            <dd>{workProjects.length}개</dd>
          </div>
          <div className="stat">
            <dt>게임</dt>
            <dd>{games.length}개</dd>
          </div>
          <div className="stat">
            <dt>재직 회사</dt>
            <dd>{companies.length}곳</dd>
          </div>
        </dl>
      </section>

      <section className="section container">
        <SectionHead
          title="대표 프로젝트"
          sub="직접 기획하고 만들어 운영하는 것들"
          link={{ to: "/projects", text: "전체 보기" }}
        />
        <div className="card-grid">
          {featuredProjects().map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="section container">
        <SectionHead title="커리어" sub="회사에서 만든 프로젝트" link={{ to: "/career", text: "자세히" }} />
        <ol className="timeline timeline-compact">
          {companies.map((c) => (
            <li key={c.key} className="timeline-item">
              <div className="timeline-head">
                <h3 className="timeline-title">{c.name}</h3>
                {c.period && <span className="timeline-period">{c.period}</span>}
              </div>
              <Tags items={c.projects.map((p) => p.name)} />
            </li>
          ))}
        </ol>
      </section>

      {posts.length > 0 && (
        <section className="section container">
          <SectionHead title="블로그" sub="만들면서 배운 것" link={{ to: "/blog", text: "전체 보기" }} />
          <ul className="rows">
            {posts.slice(0, 3).map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ul>
        </section>
      )}

      <section className="section section-last container">
        <div className="cta">
          <h2 className="cta-title">함께 만들 일이 있다면</h2>
          <p className="cta-sub">프로젝트 제안, 협업, 채용 문의를 페이지에서 바로 남길 수 있습니다.</p>
          <Link to="/contact" className="btn">
            문의하기
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
