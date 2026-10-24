import { Link, useLocation } from "react-router-dom";
import { useSeo } from "../lib/seo";

const NotFound = () => {
  const { pathname } = useLocation();
  useSeo({ title: "페이지를 찾을 수 없습니다", path: pathname });

  return (
    <section className="page container not-found">
      <p className="label">404</p>
      <h1 className="page-title">페이지를 찾을 수 없습니다.</h1>
      <Link to="/" className="btn">
        홈으로
      </Link>
    </section>
  );
};

export default NotFound;
