import Footer from "./Footer";
import Header from "./Header";
// import component 👇
import useDrawerStore from "../zustand/useDrawerStore";

import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css"; // Drawer 스타일을 불러옵니다.

const MainLayout = (props: { children: React.ReactNode }) => {
  const { isDrawerOpen, toggleDrawer } = useDrawerStore();
  return (
    <div>
      <Header />
      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        direction="left"
        style={{ maxWidth: 350, width: "80%" }}
      >
        <div>Hello World</div>
      </Drawer>

      <main>{props.children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;
