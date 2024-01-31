import { Outlet } from "react-router-dom";
import FaceHeader from "../components/header/FaceHeader";

const FaceLayOut = () => {
  return (
    <>
      <FaceHeader />
      <div style={{height:"40px", width:"100%", background:"#007aff"}}></div>
      {/* <LeftMenu /> */}
      <Outlet />
      {/* <RightMenu /> */}
      {/* <Footer /> */}
    </>
  );
};

export default FaceLayOut;
