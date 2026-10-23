import { BehindCard } from "../components/Cards";
import { behindPosts } from "../content";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const Behind = () => {
  useDocumentTitle("Behind");

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Behind the scenes</p>
        <h1 className="page-title">비하인드</h1>
        <p className="muted page-lead">
          현장에서 생긴 일, 재료를 고르는 과정, 결과물 뒤에 있는 고민을 기록합니다.
        </p>
      </header>
      {behindPosts.length ? (
        <div className="behind-grid">
          {behindPosts.map((post) => (
            <BehindCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="empty muted">아직 올라온 이야기가 없습니다.</p>
      )}
    </section>
  );
};

export default Behind;
