import Swal from "sweetalert2";

export function loginAlert() {
	Swal.fire({
		title: "회원만 가능합니다.",
		text: "로그인 하시겠습니까?",
		icon: "warning",
		showDenyButton: true,
		confirmButtonColor: "#3085d6",
		confirmButtonText: "확인",
		denyButtonText: "취소",
		allowOutsideClick: false,
	}).then((res) => {
		if (res.isConfirmed) {
			document.location.replace("/login");
		}
	});
}