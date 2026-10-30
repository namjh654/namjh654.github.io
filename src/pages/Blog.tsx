import { Link, useSearchParams } from "react-router-dom";
import { PostRow } from "../components/Cards";
import { getSeriesPosts, posts, series } from "../content";
import { topics, type TopicKey } from "../content/site";
import type { Post } from "../content/types";
import { useSeo } from "../lib/seo";

type View = "timeline" | "topic" | "series";

const VIEWS: { key: View; label: string }[] = [
  { key: "timeline", label: "타임라인" },
  { key: "topic", label: "주제별" },
  { key: "series", label: "시리즈" },
];

const Rows = ({ list }: { list: Post[] }) => (
  <ul className="rows">
    {list.map((post) => (
      <PostRow key={post.slug} post={post} />
    ))}
  </ul>
);

/** 연도 → 월 순서로 묶는다. posts 는 이미 최신순이다. */
const Timeline = () => {
  const years = Array.from(new Set(posts.map((p) => p.date.slice(0, 4))));
  return (
    <>
      {years.map((y) => {
        const inYear = posts.filter((p) => p.date.startsWith(y));
        const months = Array.from(new Set(inYear.map((p) => p.date.slice(5, 7))));
        return (
          <section key={y} className="group">
            <div className="group-head">
              <h2 className="group-title">
                {y} <span className="group-count">{inYear.length}</span>
              </h2>
            </div>
            {months.map((m) => (
              <div key={m} className="month">
                <p className="month-label">{Number(m)}월</p>
                <Rows list={inYear.filter((p) => p.date.slice(5, 7) === m)} />
              </div>
            ))}
          </section>
        );
      })}
    </>
  );
};

const Topics = () => (
  <>
    {(Object.keys(topics) as TopicKey[]).map((key) => {
      const list = posts.filter((p) => p.topic === key);
      if (!list.length) return null;
      return (
        <section key={key} className="group">
          <div className="group-head">
            <h2 className="group-title">
              {topics[key]} <span className="group-count">{list.length}</span>
            </h2>
          </div>
          <Rows list={list} />
        </section>
      );
    })}
  </>
);

const SeriesList = () =>
  series.length ? (
    <div className="card-grid">
      {series.map((s) => {
        const list = getSeriesPosts(s.slug);
        return (
          <Link key={s.slug} to={`/blog/series/${s.slug}`} className="card project-card">
            <div className="card-inner">
              <div className="card-top">
                <span className="card-kind">시리즈 · {list.length}편</span>
              </div>
              <h3 className="card-title">{s.title}</h3>
              <p className="card-text">{s.description}</p>
              <div className="card-foot">
                <span className="card-meta">최근 · {list[list.length - 1].title}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  ) : (
    <p className="empty">아직 시리즈가 없습니다.</p>
  );

const Blog = () => {
  const [params, setParams] = useSearchParams();
  const view = (VIEWS.find((v) => v.key === params.get("view"))?.key ?? "timeline") as View;
  useSeo({
    title: "블로그",
    description: "앱과 서비스를 만들고 운영하며 겪은 일을 타임라인·주제·시리즈로 기록합니다.",
    path: "/blog",
  });

  const counts: Record<View, number> = {
    timeline: posts.length,
    topic: new Set(posts.map((p) => p.topic).filter(Boolean)).size,
    series: series.length,
  };
  const select = (key: View) => setParams(key === "timeline" ? {} : { view: key }, { replace: true });

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Blog</p>
        <h1 className="page-title">블로그</h1>
        <p className="page-sub">앱과 서비스를 만들고 운영하며 겪은 일을 기록합니다. 시간순으로, 주제별로, 시리즈로 볼 수 있습니다.</p>
      </header>

      {posts.length ? (
        <>
          <div className="segment" role="tablist" aria-label="블로그 보기">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                type="button"
                role="tab"
                aria-selected={view === v.key}
                className={`segment-item${view === v.key ? " is-active" : ""}`}
                onClick={() => select(v.key)}
              >
                {v.label} <span className="segment-count">{counts[v.key]}</span>
              </button>
            ))}
          </div>
          {view === "timeline" && <Timeline />}
          {view === "topic" && <Topics />}
          {view === "series" && <SeriesList />}
        </>
      ) : (
        <p className="empty">아직 올라온 글이 없습니다.</p>
      )}
    </section>
  );
};

export default Blog;
