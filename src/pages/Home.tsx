import { Link } from "react-router-dom";
import { BehindCard, ProjectCard, SectionHead, delay } from "../components/Cards";
import { behindPosts, featuredProjects, projects } from "../content";
import { categories, services, site } from "../content/site";
import { organizationLd, useSeo } from "../lib/seo";
import ctaPhoto from "../assets/photos/cta.jpg";

const Home = () => {
  const [hero, ...rest] = featuredProjects();
  const works = rest.length ? rest : hero ? [hero] : [];
  const years = new Date().getFullYear() - site.since + 1;
  useSeo({ path: "/", image: hero?.cover, jsonLd: organizationLd });

  return (
    <>
      <section className="hero">
        {hero && <img className="hero-photo" src={hero.cover} alt="" />}
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="hero-label">{site.brandKo}</p>
          <h1 className="hero-title">{site.tagline}</h1>
          <p className="hero-sub">건축 설계 · 리모델링 · 인테리어 · 공간 브랜딩</p>
          <div className="hero-actions">
            <Link to="/projects" className="btn btn-light">
              프로젝트 보기
            </Link>
            <Link to="/contact" className="btn btn-glass">
              상담 문의
            </Link>
          </div>
        </div>
        {hero && (
          <Link to={`/projects/${hero.slug}`} className="hero-caption">
            {hero.title} →
          </Link>
        )}
      </section>

      <section className="section container statement">
        <p className="statement-text" data-reveal>
          주거부터 상업 공간, 브랜드까지.
          <br />
          <span className="muted">한 팀이 처음 상담부터 완공 후 기록까지 함께합니다.</span>
        </p>
        <dl className="stats">
          {[
            ["완성한 프로젝트", `${projects.length}`],
            ["함께한 시간", `${years}년`],
            ["작업 분야", `${Object.keys(categories).length}`],
          ].map(([k, v], i) => (
            <div key={k} className="stat" data-reveal style={delay(i)}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section container">
        <SectionHead
          label="Projects"
          title="최근 프로젝트"
          link={{ to: "/projects", text: "전체 보기" }}
        />
        <div className="project-grid">
          {works.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              index={i}
              wide={i === 0 && works.length % 2 === 1}
            />
          ))}
        </div>
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

      {behindPosts.length > 0 && (
        <section className="section container">
          <SectionHead
            label="Behind"
            title="결과물 뒤의 이야기"
            link={{ to: "/behind", text: "비하인드 보기" }}
          />
          <div className="behind-grid">
            {behindPosts.slice(0, 3).map((post, i) => (
              <BehindCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="cta">
        <img className="cta-photo" src={ctaPhoto} alt="" loading="lazy" />
        <div className="cta-shade" />
        <div className="container cta-content" data-reveal>
          <h2 className="cta-title">새 공간을 준비하고 계신가요?</h2>
          <p className="cta-sub">위치와 면적, 예산, 일정을 알려주시면 방향을 함께 잡아드립니다.</p>
          <Link to="/contact" className="btn btn-light">
            프로젝트 문의하기
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
