import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import ErrorPage from "../pages/common/ErrorPage";
import Home from "../pages/Home";
import About from "../pages/About";
import WebDev from "../pages/WebDev";
import AppDev from "../pages/AppDev";
import DevOps from "../pages/DevOps";
import Schedule from "../pages/Schedule";
import Daily from "../pages/Daily";
import Dashboard from "../pages/DashBoard";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,

    children: [
      {
        index: true, // This makes it the default child route for "/"
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "webdev",
        element: <WebDev />,
      },
      {
        path: "appdev",
        element: <AppDev />,
      },
      {
        path: "devops",
        element: <DevOps />,
      },
      {
        path: "daily",
        element: <Daily />,
      },
      {
        path: "schedule",
        element: <Schedule />,
      },

      // {
      //   path: "contact",
      //   element: <Contact />,
      // },
      // {
      //   path: "support",
      //   element: <Support />,
      // },
    ],
  },
  // {
  //   path: "/another",
  //   element: <AnotherLayout />, // 사이드메뉴가 없는 레이아웃 만들어서 작업 진행할 수 있음
  //   errorElement: <ErrorPage />,
  //   children: [
  //     { path: "page1", element: <Page1 /> },
  //     { path: "page2", element: <Page2 /> },
  //   ],
  // },
]);

export default AppRouter;
