import { useSearchParams } from "react-router-dom";
import { ProjectMasonry } from "../components/Cards";
import { projects } from "../content";
import { categories, type CategoryKey } from "../content/site";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const Projects = () => {
  useDocumentTitle("Projects");
  const [params, setParams] = useSearchParams();
  const current = params.get("category") as CategoryKey | null;
  const list = current ? projects.filter((p) => p.category === current) : projects;

  const select = (key: CategoryKey | null) =>
    setParams(key ? { category: key } : {}, { replace: true });

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Projects</p>
        <h1 className="page-title">프로젝트</h1>
        <p className="muted page-lead">
          설계부터 완공까지, 스튜디오가 함께한 공간을 프로젝트 단위로 기록합니다.
        </p>
      </header>

      <div className="filter" role="tablist" aria-label="카테고리">
        <button
          type="button"
          role="tab"
          aria-selected={!current}
          className={`pill pill-line${!current ? " is-active" : ""}`}
          onClick={() => select(null)}
        >
          전체 <span className="count">{projects.length}</span>
        </button>
        {(Object.keys(categories) as CategoryKey[]).map((key) => {
          const count = projects.filter((p) => p.category === key).length;
          if (!count) return null;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={current === key}
              className={`pill pill-line${current === key ? " is-active" : ""}`}
              onClick={() => select(key)}
            >
              {categories[key]} <span className="count">{count}</span>
            </button>
          );
        })}
      </div>

      {list.length ? (
        <ProjectMasonry list={list} />
      ) : (
        <p className="empty muted">해당 카테고리의 프로젝트가 아직 없습니다.</p>
      )}
    </section>
  );
};

export default Projects;
