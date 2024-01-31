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

function DuringRoute({ authenticated, during, component: Component }) {
    if(during === "FAIL") {
      return Swal.fire({
        title: "퓨너스 LMS에서 알립니다!",
        html : "지금은 크리에이터 신청기간이 아닙니다. 😥 <br/> 나중에 공지사항을 통해 모집기간을 알려드리도록 하겠습니다.",
        confirmButtonText: "확인",
        allowOutsideClick: false,
      }).then((res) => {
        if (res.isConfirmed) {
          document.location.replace("/");
        }
      })
    } else if (!authenticated) {
      return Swal.fire({
        title: "로그인이 필요한 페이지입니다.",
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "확인",
        confirmButtonColor: "#FF0000",
      }).then((res) => {
        if (res.isConfirmed) {
          document.location.replace("/login");
        }
      })
    } else {
      return Component
    }
}

export default DuringRoute;
