import { createBrowserRouter } from "react-router-dom";
import SiteLayout from "../components/SiteLayout";
import Home from "../pages/Home";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import Behind from "../pages/Behind";
import BehindDetail from "../pages/BehindDetail";
import Studio from "../pages/Studio";
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
      { path: "behind", element: <Behind /> },
      { path: "behind/:slug", element: <BehindDetail /> },
      { path: "studio", element: <Studio /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default AppRouter;
