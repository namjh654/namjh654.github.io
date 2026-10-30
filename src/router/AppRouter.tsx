import { createBrowserRouter } from "react-router-dom";
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
      { path: "projects", element: <Projects variant="work" /> },
      { path: "projects/:slug", element: <ProjectDetail /> },
      { path: "games", element: <Projects variant="games" /> },
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
