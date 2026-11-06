import { Link, useSearchParams } from "react-router-dom";
import { PostBento } from "../components/Cards";
import { getSeriesPosts, posts, series } from "../content";
import { topics, type TopicKey } from "../content/site";
import { useSeo } from "../lib/seo";

type View = "timeline" | "topic" | "series";

const VIEWS: { key: View; label: string }[] = [
  { key: "timeline", label: "타임라인" },
  { key: "topic", label: "주제별" },
  { key: "series", label: "시리즈" },
];

/** 연도별로 묶어 카드로 보여준다. posts 는 이미 최신순이다. 시리즈 1편은 크게 강조된다. */
const Timeline = () => {
  const years = Array.from(new Set(posts.map((p) => p.date.slice(0, 4))));
  return (
    <>
      {years.map((y) => {
        const inYear = posts.filter((p) => p.date.startsWith(y));
        return (
          <section key={y} className="group">
            <div className="group-head">
              <h2 className="group-title">
                {y} <span className="group-count">{inYear.length}</span>
              </h2>
            </div>
            <PostBento list={inYear} />
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
          <PostBento list={list} emphasize={false} />
        </section>
      );
    })}
  </>
);

/** 시리즈마다 소개와 회차 카드. 1편(대표)이 가장 크게 보인다. */
const SeriesList = () =>
  series.length ? (
    <>
      {series.map((s) => {
        const list = getSeriesPosts(s.slug);
        return (
          <section key={s.slug} className="group">
            <div className="group-head">
              <h2 className="group-title">
                {s.title} <span className="group-count">{list.length}편</span>
              </h2>
              <p className="group-sub">
                {s.description} · <Link to={`/blog/series/${s.slug}`}>시리즈 전체 보기 ›</Link>
              </p>
            </div>
            <PostBento list={list} />
          </section>
        );
      })}
    </>
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
