import { Link } from "react-router-dom";
import { PostBento, ProjectCard, SectionHead, StackOverview, Tags } from "../components/Cards";
import { careerProjects, companies, featuredProjects, posts, selfProjects, sideProjects, stackUsage } from "../content";
import { site } from "../content/site";
import { personLd, useSeo } from "../lib/seo";

const Home = () => {
  useSeo({ path: "/", jsonLd: personLd });
  /** 회사에서 만들어 Google Play·App Store 에 낸 앱 */
  const storeApps = careerProjects.filter((p) => p.links?.store).length;
  const stackCount = stackUsage.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <section className="hero container">
        <p className="eyebrow">
          {site.brandKo} · {site.experience} {site.role}
        </p>
        <h1 className="hero-title">{site.tagline}</h1>
        <p className="hero-sub">{site.intro}</p>
        <div className="hero-actions">
          <Link to="/projects" className="btn">
            프로젝트 보기
          </Link>
          <Link to="/career" className="btn btn-secondary">
            커리어
          </Link>
          <a href={site.github} className="btn btn-secondary" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
      </section>

      <section className="container">
        <dl className="stats stats-4">
          <div className="stat">
            <dt>경력</dt>
            <dd>{site.experience}</dd>
          </div>
          <div className="stat">
            <dt>스토어 출시 앱</dt>
            <dd>{storeApps}개</dd>
          </div>
          <div className="stat">
            <dt>자체 프로젝트</dt>
            <dd>{selfProjects.length}개</dd>
          </div>
          <div className="stat">
            <dt>사용 기술</dt>
            <dd>{stackCount}개</dd>
          </div>
        </dl>
      </section>

      <section className="section container">
        <SectionHead
          title="프로젝트"
          sub="앱 · 웹 · 데스크탑, 기획부터 백엔드와 배포까지 직접 만든 것들"
          link={{ to: "/projects", text: "전체 보기" }}
        />
        <div className="card-grid">
          {featuredProjects().map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
        {sideProjects.length > 0 && (
          <p className="section-note">
            게임 같은 사이드 프로젝트도 있습니다 · <Link to="/projects?group=side">사이드 {sideProjects.length}개 보기 ›</Link>
          </p>
        )}
      </section>

      <section className="section container">
        <SectionHead
          title="기술 스택"
          sub="프로젝트에 실제로 쓴 기술 · 숫자는 사용한 프로젝트 수"
          link={{ to: "/about", text: "소개" }}
        />
        <StackOverview />
      </section>

      <section className="section container">
        <SectionHead title="커리어" sub="회사에서 개발한 모바일 앱과 SDK · 최신순" link={{ to: "/career", text: "자세히" }} />
        <ol className="timeline timeline-compact">
          {companies.map((c) => (
            <li key={c.key} className="timeline-item">
              <div className="timeline-head">
                <h3 className="timeline-title">{c.name}</h3>
                {c.period && <span className="timeline-period">{c.period}</span>}
              </div>
              <Tags items={c.projects.length ? c.projects.map((p) => p.name) : (c.skills ?? [])} />
            </li>
          ))}
        </ol>
      </section>

      {posts.length > 0 && (
        <section className="section container">
          <SectionHead title="블로그" sub="타임라인 · 주제 · 시리즈로 정리한 기록" link={{ to: "/blog", text: "전체 보기" }} />
          <PostBento list={posts.slice(0, 4)} emphasize={false} />
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
