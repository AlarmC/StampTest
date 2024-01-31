import App from "./App";
import { createRoot } from "react-dom/client";
// import axios from "axios";
import rootReducer from "./modules";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import ReduxThunk from "redux-thunk";
import { tempSetUser } from "./modules/user";
import { tempSetDotinfo } from "./modules/dotInfo";
import { decrypt } from "./lib/api/tokenCrypto";
// import * as CommonAxios from "./components/CommonAxios";
import Swal from "sweetalert2";
import "./font/font_css.css";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
  // applyMiddleware(ReduxThunk)
);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// axios.defaults.withCredentials = true;

function loadUser() {
  try {
    // const user = localStorage.getItem("serveInfo");
    const data = localStorage.getItem("loginState");
    if(data != "auto" && data != null){
      const user = decrypt(sessionStorage.getItem("serveInfo"), "serveInfo");
      if (!user) return;
      
      store.dispatch(tempSetUser(user));
    } else if(data != null) {
      const user = decrypt(localStorage.getItem("serveInfo"), "serveInfo");
      if (!user) return;
      
      store.dispatch(tempSetUser(user));
    }

    const dotinfo = decrypt(localStorage.getItem("dotInfo"), "dotInfo");
    if (!dotinfo) return;
    
    store.dispatch(tempSetDotinfo(dotinfo));

  } catch (e) {
    // console.log("로그인 안 됨");
  }
}

// CommonAxios.CommonGetToken();
loadUser();

document.addEventListener("keyup", function (e) {
  var keyCode = e.keyCode ? e.keyCode : e.which;
  if (keyCode == 44) {
    stopPrntScr();
    Swal.fire({
      title: "캡처 금지",
      icon: "error",
      confirmButtonColor: "#d33",
      confirmButtonText: "확인",
      allowOutsideClick: false,
    });
  }
});

function stopPrntScr() {
  var inpFld = document.createElement("input");
  inpFld.setAttribute("value", ".");
  inpFld.setAttribute("width", "0");
  inpFld.style.height = "0px";
  inpFld.style.width = "0px";
  inpFld.style.border = "0px";
  document.body.appendChild(inpFld);
  inpFld.select();
  document.execCommand("copy");
  inpFld.remove(inpFld);
}

// const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    {/* <Provider store={store}> */}
    {/* <CookiesProvider> */}
    <Provider store={store}>
      <App />
    </Provider>
    {/* </CookiesProvider> */}
    {/* </Provider> */}
  </>
);
