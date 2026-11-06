import { Link, useSearchParams } from "react-router-dom";
import { ProjectCard } from "../components/Cards";
import { careerProjects, companies, games, getStack, platformGroupsOf, selfProjects } from "../content";
import { platformGroups, type PlatformGroupKey } from "../content/site";
import type { Project } from "../content/types";
import { useSeo } from "../lib/seo";

interface Props {
  variant: "work" | "games";
}

type Group = "all" | "self" | "career";

const GROUPS: { key: Group; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "self", label: "자체 프로젝트" },
  { key: "career", label: "커리어 프로젝트" },
];

const Grid = ({ list }: { list: Project[] }) =>
  list.length ? (
    <div className="card-grid">
      {list.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  ) : (
    <p className="empty">조건에 맞는 항목이 없습니다.</p>
  );

/** 게임 목록 */
const Games = () => {
  useSeo({
    title: "게임",
    description: "봉봉이 개발한 게임 목록. 플랫폼과 기술 스택, 개발 상태.",
    path: "/games",
  });
  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Games</p>
        <h1 className="page-title">게임</h1>
        <p className="page-sub">기획부터 밸런스, 개발까지 혼자 만드는 게임입니다.</p>
      </header>
      <Grid list={games} />
    </section>
  );
};

/** 프로젝트: 자체 프로젝트와 커리어(회사) 프로젝트를 나누고, 화면 구분(앱·웹·데스크탑)과 기술로 거른다. */
const Work = () => {
  const [params, setParams] = useSearchParams();
  const group = (GROUPS.find((g) => g.key === params.get("group"))?.key ?? "all") as Group;
  const type = (params.get("type") as PlatformGroupKey | null) ?? undefined;
  const platform = type && type in platformGroups ? type : undefined;
  const stack = getStack(params.get("stack"));
  useSeo({
    title: "프로젝트",
    description: `앱·웹·데스크탑으로 직접 만든 자체 프로젝트 ${selfProjects.length}개와 회사에서 만든 커리어 프로젝트 ${careerProjects.length}개.`,
    path: "/projects",
  });

  const update = (key: string, value?: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const pass = (p: Project) =>
    (!platform || platformGroupsOf(p).includes(platform)) && (!stack || stack.projects.includes(p));
  const self = selfProjects.filter(pass);
  const career = careerProjects.filter(pass);
  const base = [...selfProjects, ...careerProjects];
  const inGroup = group === "self" ? selfProjects : group === "career" ? careerProjects : base;

  const counts: Record<Group, number> = { all: self.length + career.length, self: self.length, career: career.length };
  const typeCount = (k?: PlatformGroupKey) =>
    inGroup.filter((p) => (!k || platformGroupsOf(p).includes(k)) && (!stack || stack.projects.includes(p))).length;

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Projects</p>
        <h1 className="page-title">프로젝트</h1>
        <p className="page-sub">
          직접 기획·개발해 운영하는 자체 프로젝트와, {companies.length}곳의 회사에서 만든 커리어 프로젝트입니다. 게임은{" "}
          <Link to="/games">게임</Link>에 따로 모았습니다.
        </p>
      </header>

      <div className="filters">
        <div className="segment" role="tablist" aria-label="프로젝트 구분">
          {GROUPS.map((g) => (
            <button
              key={g.key}
              type="button"
              role="tab"
              aria-selected={group === g.key}
              className={`segment-item${group === g.key ? " is-active" : ""}`}
              onClick={() => update("group", g.key === "all" ? undefined : g.key)}
            >
              {g.label} <span className="segment-count">{counts[g.key]}</span>
            </button>
          ))}
        </div>

        <div className="chips" role="group" aria-label="화면 구분">
          {[undefined, ...(Object.keys(platformGroups) as PlatformGroupKey[])].map((k) => (
            <button
              key={k ?? "all"}
              type="button"
              aria-pressed={platform === k}
              className={`chip${platform === k ? " is-active" : ""}`}
              onClick={() => update("type", k)}
            >
              {k ? platformGroups[k].label : "모든 화면"} <span className="chip-count">{typeCount(k)}</span>
            </button>
          ))}
          {stack && (
            <button type="button" className="chip is-active" onClick={() => update("stack")} aria-label={`${stack.name} 필터 해제`}>
              {stack.name} ✕
            </button>
          )}
        </div>
      </div>

      {group !== "career" && (
        <section className="group">
          {group === "all" && (
            <div className="group-head">
              <h2 className="group-title">
                자체 프로젝트 <span className="group-count">{self.length}</span>
              </h2>
              <p className="group-sub">직접 기획하고 만들어 운영하는 서비스·템플릿</p>
            </div>
          )}
          <Grid list={self} />
        </section>
      )}

      {group !== "self" && (
        <section className="group">
          {group === "all" && (
            <div className="group-head">
              <h2 className="group-title">
                커리어 프로젝트 <span className="group-count">{career.length}</span>
              </h2>
              <p className="group-sub">
                회사에 재직하며 만든 프로젝트 · <Link to="/career">회사별로 보기 ›</Link>
              </p>
            </div>
          )}
          <Grid list={career} />
        </section>
      )}
    </section>
  );
};

const Projects = ({ variant }: Props) => (variant === "games" ? <Games /> : <Work />);

export default Projects;
