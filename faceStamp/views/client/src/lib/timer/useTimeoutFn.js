import { useCallback, useEffect, useRef } from "react";
		// props 실행할 함수, 몇 초 뒤 실행할지
const useTimeoutFn = (fn, ms) => {
  // timeOut에 대한 Id를 기억할 변수
  const timeoutId = useRef();
  // 함수도 Ref를 통해 최적화
  const callback = useRef(fn);
  
  useEffect(() => {
    // 마운트시 ref를 통해 함수 기억 
    callback.current = fn;
  }, [fn]);
  
  // 지정한 timeOut이 끝나면 함수 실행
  const run = useCallback(() => {
    // 이전에 등록한 timeOutId가 남아있다면 clear로 해제를 해준다.
    timeoutId.current && clearTimeout(timeoutId.current);
    
    // timeOut을 세팅하고 timeOut이 끝나면 fn함수를 실행 시킨다
    timeoutId.current = setTimeout(() => {
      callback.current();
    }, ms);
  }, [ms]);

  // 함수 종료
  const clear = useCallback(() => {
    // timeOutId가 있다면 clear로 해제를 해준다.
    timeoutId.current && clearTimeout(timeoutId.current);
  }, []);

  // clean-up
  useEffect(() => clear, [clear]);

  return [run, clear];
};

export default useTimeoutFn;