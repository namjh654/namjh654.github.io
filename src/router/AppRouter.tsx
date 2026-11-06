import { createBrowserRouter, Navigate } from "react-router-dom";
import SiteLayout from "../components/SiteLayout";
import Home from "../pages/Home";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import Career from "../pages/Career";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import BlogSeries from "../pages/BlogSeries";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <SiteLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:slug", element: <ProjectDetail /> },
      // 예전 게임 메뉴 주소. 게임은 프로젝트 > 사이드 로 옮겼다.
      { path: "games", element: <Navigate to="/projects?group=side" replace /> },
      { path: "career", element: <Career /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/series/:slug", element: <BlogSeries /> },
      { path: "blog/:slug", element: <BlogPost /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default AppRouter;
