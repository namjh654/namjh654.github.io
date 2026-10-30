import { Link, useParams } from "react-router-dom";
import { getSeries, getSeriesPosts } from "../content";
import { site } from "../content/site";
import { formatDate, pageUrl, useSeo } from "../lib/seo";
import NotFound from "./NotFound";

/** 시리즈 한 개의 글 목록. 1편부터 순서대로 보인다. */
const BlogSeries = () => {
  const { slug = "" } = useParams();
  const s = getSeries(slug);
  const path = `/blog/series/${slug}`;
  const list = s ? getSeriesPosts(s.slug) : [];
  useSeo({
    title: s && `${s.title} 시리즈`,
    description: s?.description,
    path,
    jsonLd: s && {
      "@context": "https://schema.org",
      "@type": "CreativeWorkSeries",
      name: s.title,
      description: s.description,
      url: pageUrl(path),
      author: { "@type": "Person", name: site.brandKo, url: site.url },
      hasPart: list.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: pageUrl(`/blog/${p.slug}`) })),
    },
  });
  if (!s) return <NotFound />;

  return (
    <section className="page container narrow">
      <header className="detail-head">
        <Link to="/blog?view=series" className="back-link">
          ‹ 시리즈
        </Link>
        <p className="eyebrow">Series · {list.length}편</p>
        <h1 className="page-title">{s.title}</h1>
        <p className="page-sub">{s.description}</p>
      </header>
      <ol className="rows series-rows">
        {list.map((post, i) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}`} className="row">
              <span className="series-num">{post.seriesOrder ?? i + 1}</span>
              <div className="row-main">
                <p className="row-meta">{formatDate(post.date)}</p>
                <h3 className="row-title">{post.title}</h3>
                <p className="row-text">{post.excerpt}</p>
              </div>
              <span className="row-arrow" aria-hidden>
                ›
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default BlogSeries;
