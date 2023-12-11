import axios from "axios";
import Swal from "sweetalert2";

export function CommonAxios(url, sendData, result) {
  const options = {
    method: "POST",
    header: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTP-8",
    },
    data: sendData,
  };

  axios(url, options)
    .then((response) => {
      result(response.data);
    })
    .catch((err) => console.error("오류"));
}

export function CommonGetAxios(url, no, result) {
  const options = {
    method: "GET",
    header: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTP-8",
    },
    params: {
      no: no,
    },
  };

  axios(url, options)
    .then((response) => {
      result(response.data);
    })
    .catch((err) => console.error("오류"));
}

export function CommonGetToken() {
  if (localStorage.getItem("serveInfo")) {
    const url = process.env.REACT_APP_HOSTDONAME + "/api/tokenEnd";

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "x-www-form-urlencoded",
      },
    };
    const FAIL = "쿠키가 삭제되었습니다.";
    axios.post(url, config).then((res) => {
      if (res.data.messageinfo.message === FAIL) {
        Swal.fire({
          title: "로그인 만료",
          text: "로그인 페이지로 이동합니다.",
          allowOutsideClick: false,
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        }).then((res) => {
          if (res.isConfirmed) {
            localStorage.removeItem("serveInfo");
            document.location.href = "/login";
          }
        });
      } else {
      }
    });
  } else {
  }
}
