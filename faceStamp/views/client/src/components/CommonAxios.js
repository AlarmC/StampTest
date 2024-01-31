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
