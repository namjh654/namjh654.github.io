import { Link, useParams } from "react-router-dom";
import { getPost, getProject, getSeries, getSeriesPosts } from "../content";
import { site, topics } from "../content/site";
import { absoluteUrl, formatDate, pageUrl, useSeo } from "../lib/seo";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug = "" } = useParams();
  const post = getPost(slug);
  const path = `/blog/${slug}`;
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
      author: { "@type": "Person", name: site.brandKo, url: site.url },
    },
  });
  if (!post) return <NotFound />;

  const project = post.project ? getProject(post.project) : undefined;
  const inSeries = getSeries(post.series);
  const episodes = inSeries ? getSeriesPosts(inSeries.slug) : [];
  const at = episodes.indexOf(post);
  const topic = post.topic && topics[post.topic];

  return (
    <article className="page container narrow">
      <header className="detail-head">
        <Link to="/blog" className="back-link">
          ‹ 블로그
        </Link>
        <p className="eyebrow">
          {formatDate(post.date)}
          {topic && ` · ${topic}`}
          {post.tags?.map((t) => ` · ${t}`)}
        </p>
        <h1 className="page-title">{post.title}</h1>
        <p className="page-sub">{post.excerpt}</p>
      </header>

      {inSeries && (
        <nav className="series-box" aria-label="시리즈">
          <Link to={`/blog/series/${inSeries.slug}`} className="series-box-title">
            시리즈 · {inSeries.title} ({at + 1}/{episodes.length}) ›
          </Link>
          <ol className="series-box-list">
            {episodes.map((ep) => (
              <li key={ep.slug} className={ep === post ? "is-current" : undefined}>
                {ep === post ? ep.title : <Link to={`/blog/${ep.slug}`}>{ep.title}</Link>}
              </li>
            ))}
          </ol>
        </nav>
      )}

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
            case "code":
              return (
                <pre key={i} className="prose-code" data-lang={block.lang}>
                  <code>{block.body}</code>
                </pre>
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

      {episodes[at + 1] && (
        <Link to={`/blog/${episodes[at + 1].slug}`} className="next-card">
          <span className="next-label">다음 편</span>
          <span className="next-title">{episodes[at + 1].title} ›</span>
        </Link>
      )}

      {project && (
        <Link to={`/projects/${project.slug}`} className="next-card">
          <span className="next-label">관련 프로젝트</span>
          <span className="next-title">{project.title} ›</span>
        </Link>
      )}
    </article>
  );
};

export default BlogPost;
