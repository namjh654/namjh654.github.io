import { Link } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Not Found");
  return (
    <section className="page container not-found">
      <p className="eyebrow">404</p>
      <h1 className="page-title">페이지를 찾을 수 없습니다.</h1>
      <Link to="/" className="button">
        홈으로
      </Link>
    </section>
  );
};

export default NotFound;
