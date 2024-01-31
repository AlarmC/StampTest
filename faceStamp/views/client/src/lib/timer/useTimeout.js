import { useEffect } from "react";
import useTimeoutFn from "./useTimeoutFn";

const useTimeout = (fn, ms) => {
  // 정의한 useTimeoutFn Hook 사용
  const [run, clear] = useTimeoutFn(fn, ms);

  // 바로 실행 후 종료
  useEffect(() => {
    run();
    return clear;
  }, [run, clear]);

  // 컴포넌트가 로딩 된 후 바로 실행하므로
  // 이것을 취소해주는 clear만 반환
  return clear;
};

export default useTimeout;