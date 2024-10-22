import Footer from "./Footer";
import Header from "./Header";

const MainLayout = (props: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />

      <main>{props.children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;
