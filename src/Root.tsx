import "./Root.css";
import { Outlet } from "react-router";
import Layout from "./layout/MainLayout";

function Root() {
  return (
    <Layout>
      <div className="App">
        {/* Outlet으로 하위 페이지 호출 */}
        <Outlet />
      </div>
    </Layout>
  );
}

export default Root;
