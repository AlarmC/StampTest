import axios from "axios";
// import { set } from "immer/dist/internal";
import jwt_decode from "jwt-decode";

export function tokenReissue() {
  // const localToken = window.localStorage.getItem("serveInfo");
  const localToken = localStorage.getItem("serveInfo");
  if (localToken) {
    try {
      axios
        .post("/api/tokenTest", {
          headers: {
            Accept: "application/json",
            "Content-Type": "x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.data.messageinfo.message === true) {
            localStorage.clear();
          }
        });
    } catch (e) {}
  }
}

export function tokenUpdate() {
  const localToken = localStorage.getItem("serveInfo");
  if (localToken) {
    try {
      axios
        .post("/api/tokenTest", {
          headers: {
            Accept: "application/json",
            "Content-Type": "x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.data.messageinfo.message === false) {
            localStorage.clear();
          }
        });
    } catch (e) {}
  }
}
