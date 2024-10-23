import { createBrowserRouter } from "react-router-dom";
import Root from "../Root";
import ErrorPage from "../pages/common/ErrorPage";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Support from "../pages/Support";

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
        path: "home",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "support",
        element: <Support />,
      },
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
