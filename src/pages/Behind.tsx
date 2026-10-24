import { BehindRow } from "../components/Cards";
import { behindPosts } from "../content";
import { useSeo } from "../lib/seo";

const Behind = () => {
  useSeo({
    title: "비하인드",
    description: "현장에서 생긴 일, 재료를 고르는 과정, 결과물 뒤에 있는 봉봉 스튜디오의 작업 이야기.",
    path: "/behind",
  });

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Behind</p>
        <h1 className="page-title">비하인드</h1>
        <p className="page-sub">결과물 뒤에 있는 과정과 고민을 기록합니다.</p>
      </header>
      {behindPosts.length ? (
        <ul className="rows">
          {behindPosts.map((post) => (
            <BehindRow key={post.slug} post={post} />
          ))}
        </ul>
      ) : (
        <p className="empty">아직 올라온 이야기가 없습니다.</p>
      )}
    </section>
  );
};

export default Behind;
