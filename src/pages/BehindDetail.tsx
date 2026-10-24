import { Link, useParams } from "react-router-dom";
import { getBehindPost, getProject } from "../content";
import { site } from "../content/site";
import { absoluteUrl, formatDate, pageUrl, useSeo } from "../lib/seo";
import NotFound from "./NotFound";

const BehindDetail = () => {
  const { slug = "" } = useParams();
  const post = getBehindPost(slug);
  const path = `/behind/${slug}`;
  useSeo({
    title: post?.title,
    description: post?.excerpt,
    image: post?.cover,
    path,
    type: "article",
    jsonLd: post && {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      ...(post.cover && { image: absoluteUrl(post.cover) }),
      datePublished: post.date,
      keywords: post.tags?.join(", "),
      mainEntityOfPage: pageUrl(path),
      author: { "@type": "Organization", name: site.brand, url: site.url },
      publisher: { "@type": "Organization", name: site.brand, url: site.url },
    },
  });
  if (!post) return <NotFound />;

  const project = post.project ? getProject(post.project) : undefined;

  return (
    <article className="page container narrow">
      <header className="detail-head">
        <Link to="/behind" className="back-link">
          ‹ 비하인드
        </Link>
        <p className="eyebrow">
          {formatDate(post.date)}
          {post.tags?.map((t) => ` · ${t}`)}
        </p>
        <h1 className="page-title">{post.title}</h1>
        <p className="page-sub">{post.excerpt}</p>
      </header>

      {post.cover && (
        <div className="detail-photo">
          <img src={post.cover} alt={post.title} />
        </div>
      )}

      <div className="prose">
        {post.blocks.map((block, i) => {
          switch (block.type) {
            case "text":
              return (
                <section key={i} className="prose-section">
                  {block.heading && <h2 className="prose-heading">{block.heading}</h2>}
                  {block.body.split("\n").map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </section>
              );
            case "image":
              return (
                <figure key={i} className="prose-figure">
                  <img src={block.src} alt={block.caption ?? ""} loading="lazy" />
                  {block.caption && <figcaption>{block.caption}</figcaption>}
                </figure>
              );
            case "quote":
              return (
                <blockquote key={i} className="prose-quote">
                  <p>{block.body}</p>
                  {block.by && <cite>{block.by}</cite>}
                </blockquote>
              );
            default:
              return null;
          }
        })}
      </div>

      {project && (
        <Link to={`/projects/${project.slug}`} className="next-card">
          <span className="next-label">관련 프로젝트</span>
          <span className="next-title">{project.title} ›</span>
        </Link>
      )}
    </article>
  );
};

export default BehindDetail;
