import { PostRow } from "../components/Cards";
import { posts } from "../content";
import { useSeo } from "../lib/seo";

const Blog = () => {
  useSeo({
    title: "블로그",
    description: "서비스와 게임을 만들면서 배운 것, 문제를 푼 과정, 회고를 기록합니다.",
    path: "/blog",
  });

  return (
    <section className="page container">
      <header className="page-head">
        <p className="eyebrow">Blog</p>
        <h1 className="page-title">블로그</h1>
        <p className="page-sub">만들면서 배운 것과 문제를 푼 과정을 기록합니다.</p>
      </header>
      {posts.length ? (
        <ul className="rows">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </ul>
      ) : (
        <p className="empty">아직 올라온 글이 없습니다.</p>
      )}
    </section>
  );
};

export default Blog;
