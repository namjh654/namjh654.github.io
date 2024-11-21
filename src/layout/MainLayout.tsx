import Footer from "./Footer";
import Header from "./Header";
// import component 👇
import useDrawerStore from "../zustand/useDrawerStore";

import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css"; // Drawer 스타일을 불러옵니다.
import DrawerLayout from "./Drawer";

const MainLayout = (props: { children: React.ReactNode }) => {
  const { isDrawerOpen, toggleDrawer } = useDrawerStore();

  return (
    <main
      style={{
        flex: 1, // Header/Footer 제외한 공간을 차지
        overflowY: "auto", // 스크롤 필요 시 활성화
      }}
    >
      <Header />
      <Drawer
        open={isDrawerOpen}
        onClose={toggleDrawer}
        direction="left"
        style={{ maxWidth: 350, width: "80%", zIndex: 1001 }}
      >
        <DrawerLayout />
      </Drawer>
      <div className="contentWrap">{props.children}</div>
      <Footer />
    </main>
  );
};

export default MainLayout;
