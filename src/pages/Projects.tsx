import { useSearchParams } from "react-router-dom";
import { ProjectCard } from "../components/Cards";
import { projects } from "../content";
import { categories, type CategoryKey } from "../content/site";
import { useSeo } from "../lib/seo";

const Projects = () => {
  const [params, setParams] = useSearchParams();
  const current = params.get("category") as CategoryKey | null;
  const list = current ? projects.filter((p) => p.category === current) : projects;
  useSeo({
    title: "프로젝트",
    description: "봉봉 스튜디오가 설계하고 시공한 주거·상업·리모델링·브랜딩 프로젝트 포트폴리오.",
    path: "/projects",
  });

  const select = (key: CategoryKey | null) =>
    setParams(key ? { category: key } : {}, { replace: true });

  const tabs: [CategoryKey | null, string, number][] = [
    [null, "전체", projects.length],
    ...(Object.keys(categories) as CategoryKey[])
      .map((k) => [k, categories[k], projects.filter((p) => p.category === k).length] as [CategoryKey, string, number])
      .filter(([, , n]) => n > 0),
  ];

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Projects</p>
        <h1 className="page-title">프로젝트</h1>
        <p className="page-sub">설계부터 완공까지, 스튜디오가 함께한 공간을 기록합니다.</p>
      </header>

      <div className="segment" role="tablist" aria-label="카테고리">
        {tabs.map(([key, label, n]) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={current === key}
            className={`segment-item${current === key ? " is-active" : ""}`}
            onClick={() => select(key)}
          >
            {label} <span className="segment-count">{n}</span>
          </button>
        ))}
      </div>

      {list.length ? (
        <div className="card-grid">
          {list.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <p className="empty">해당 카테고리의 프로젝트가 아직 없습니다.</p>
      )}
    </section>
  );
};

export default Projects;
