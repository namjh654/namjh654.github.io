import { Link, useParams } from "react-router-dom";
import { getBehindPost, getProject } from "../content";
import { formatDate, useDocumentTitle } from "../lib/useDocumentTitle";
import NotFound from "./NotFound";

const BehindDetail = () => {
  const { slug = "" } = useParams();
  const post = getBehindPost(slug);
  useDocumentTitle(post?.title);
  if (!post) return <NotFound />;

  const project = post.project ? getProject(post.project) : undefined;

  return (
    <article className="page">
      <header className="container narrow detail-head">
        <Link to="/behind" className="text-link back-link">
          ← Behind
        </Link>
        <p className="eyebrow">
          {formatDate(post.date)}
          {post.tags?.map((t) => ` · ${t}`)}
        </p>
        <h1 className="page-title">{post.title}</h1>
        <p className="lead muted">{post.excerpt}</p>
      </header>

      <div className="container">
        <div className="detail-cover media">
          <img src={post.cover} alt={post.title} />
        </div>
      </div>

      <div className="container narrow prose behind-body">
        {post.blocks.map((block, i) => {
          switch (block.type) {
            case "text":
              return (
                <section key={i}>
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
                  <p>“{block.body}”</p>
                  {block.by && <cite>— {block.by}</cite>}
                </blockquote>
              );
            default:
              return null;
          }
        })}
      </div>

      {project && (
        <Link to={`/projects/${project.slug}`} className="next-project">
          <div className="container next-inner">
            <span className="eyebrow">Related Project</span>
            <span className="next-title">{project.title} 결과물 보기 →</span>
          </div>
        </Link>
      )}
    </article>
  );
};

export default BehindDetail;
