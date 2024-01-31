import Swal from "sweetalert2";

// Swal.fire({
// 	title: "접근할 수 없는 페이지입니다.",
// 	icon: "error",
// 	confirmButtonText: "확인",
// 	confirmButtonColor: "#FF0000",
// }).then((res) => {
// 	if (res.isConfirmed) {
// 		document.location.href = '/login'
// 	}
// });

function PrivateRoute({ authenticated, component: Component }) {
  return authenticated
    ? Component
    : Swal.fire({
        title: "로그인 필요",
        text : "로그인 하시겠습니까?",
        icon: "error",
        showDenyButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
        denyButtonText: "취소",
      }).then((res) => {
        if (res.isConfirmed) {
          document.location.replace("/login");
        }
      });
}

export default PrivateRoute;
