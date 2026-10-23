import { Link } from "react-router-dom";
import { BehindCard } from "../components/Cards";
import { behindPosts } from "../content";
import { formatDate, useSeo } from "../lib/seo";

const Behind = () => {
  useSeo({
    title: "비하인드",
    description: "현장에서 생긴 일, 재료를 고르는 과정, 결과물 뒤에 있는 봉봉 스튜디오의 작업 이야기.",
    path: "/behind",
    image: behindPosts[0]?.cover,
  });
  const [lead, ...rest] = behindPosts;

  return (
    <section className="page container">
      <header className="page-head" data-reveal>
        <p className="label">Behind</p>
        <h1 className="page-title">비하인드</h1>
        <p className="page-lead">결과물 뒤에 있는 과정과 고민을 기록합니다.</p>
      </header>

      {lead ? (
        <>
          <Link to={`/behind/${lead.slug}`} className="behind-lead" data-reveal>
            <div className="frame">
              <img src={lead.cover} alt={lead.title} />
            </div>
            <div className="behind-lead-body">
              <p className="card-meta">
                {formatDate(lead.date)}
                {lead.tags?.length ? ` · ${lead.tags[0]}` : ""}
              </p>
              <h2 className="behind-lead-title">{lead.title}</h2>
              <p className="card-excerpt">{lead.excerpt}</p>
              <span className="more-link">
                읽어보기 <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
          <div className="behind-grid">
            {rest.map((post, i) => (
              <BehindCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </>
      ) : (
        <p className="empty">아직 올라온 이야기가 없습니다.</p>
      )}
    </section>
  );
};

export default Behind;
