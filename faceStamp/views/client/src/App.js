import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/common.css";
import NowDate from "./lib/date/NowDate";
import NoLayout from "./layout/NoLayout";
import FaceLayOut from "./layout/FaceLayOut";

//도트 관련 페이지
import DotLoginPage from "./pages/DotLoginPage";
import DotMain from "./pages/DotMainPage";
import DotSettingPage from "./pages/DotSettingPage";
import ImageDot from "./pages/ImageDot";
import DotListPage from "./pages/DotListPage";
import DotPrintPage from "./pages/DotPrintPage";
import DotSettingTema from "./pages/DotSettingTema";
import ImageTema from "./pages/ImageTema";


import TempLayOut from "./layout/TempLayOut";
// import TempPage from "./pages/TempPage";
import TestPage from "./pages/TestPage";
import KonvaTest from "./pages/KonvaTest";

import HalfTone from "./components/dotcanvas/HalfTone";

function App() {

  const { user } = useSelector(({ user }) => ({
    user: user.user,
  }));

  let nowDate = new Date(NowDate());
  let endDate = new Date("2022-12-25 00:00:00");

  const during = () => {
    if (nowDate < endDate) {
      return "OK";
    } else {
      return "FAIL";
    }
  };

  // tokenReissue();
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Routes>
        {/* 헤더 푸터 포함 */}
        {/* 페이스 도장 관련 */}
        <Route path="" element={<FaceLayOut />}>
          <Route path="/" element={<DotMain />} />
          <Route path="/dot/:type" element={<ImageDot />} />
          <Route path="/dotset/:type" element={<DotSettingPage />} /> 
          <Route path="/dotlist" element={<DotListPage />} />
          <Route path="/dotprint" element={<DotPrintPage />} />
          <Route path="/dotset/tema" element={<DotSettingTema />} />
          <Route path="/tema/:type" element={<ImageTema />} />
        </Route>
        {/* 헤더 푸터 미포함 */}
        <Route path="" element={<NoLayout />}>
          <Route path="/dotlogin" element={<DotLoginPage />} />
          <Route path="/halft" element={<HalfTone />} />
          <Route path="/konvt" element={<KonvaTest />} /> 
        </Route>
        {/* <Route path="" element={<TempLayOut />}>
          <Route path="/test" element={<TestPage />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
