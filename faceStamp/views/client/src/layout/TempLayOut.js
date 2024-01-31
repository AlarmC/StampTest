import { Outlet } from "react-router-dom";
import TempHeader from "../components/header/TempHeader";
import TempFooter from "../components/footer/TempFooter";

const TempLayOut = () => {
  return (
    <>
      <TempHeader />
      {/* <LeftMenu /> */}
      <Outlet />
      {/* <RightMenu /> */}
      {/* <Footer /> */}
      <TempFooter />
    </>
  );
};

export default TempLayOut;
