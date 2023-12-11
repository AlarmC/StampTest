import { useRef, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
function EmailConfirm(props) {
  //이메일 인증 타이머

  const [min, setMin] = useState(3);
  const [sec, setSec] = useState(0);
  const time = useRef(180);
  const timerId = useRef(null);
  const [emailConfirmValue, setEmailConfirmValue] = useState("");
  const [emailConfirmDisable, setEmailConfirmDisable] = useState(false); //이메일 인증 disable
  const [emailConfirmBtn, setEmailConfirmBtn] = useState(false); //이메일 인증 버튼 Disalbe

  useEffect(() => {
    timerId.current = setInterval(() => {
      setMin(parseInt(props.timeR.current / 60));
      setSec(props.timeR.current % 60);

      props.timeR.current -= 1;
    }, 1000);
    return () => clearInterval(timerId.current);
  }, [props.timeR.current]);

  useEffect(() => {
    if (props.timeR.current < 0) {
      clearInterval(timerId.current);
      props.setMailNum("");
    }
  }, [sec, props.timeR.current]);
  // 이메일 인증번호 입력시
  const onChangeEmailConfirm = useCallback((e) => {
    setEmailConfirmValue(e.target.value);
  }, []);

  // 이메일 확인 버튼
  function emailConfirm() {
    // console.log(props.mailNum);
    // console.log(emailConfirmValue);
    if (props.mailNum !== "") {
      if (emailConfirmValue == props.mailNum) {
        props.setEmailConfirmTest(true);
        props.setEmailBtn(true);
        props.setInputEmailDisable(true);
        setEmailConfirmDisable(true);
        setEmailConfirmBtn(true);
        clearInterval(timerId.current);
      } else {
        props.setEmailConfirmTest(false);
      }
    }
  }

  return (
    <>
      <div className="email-CitationBox">
        <Divcitation
          className="email-CitationInner"
          min={min}
          sec={sec}
          emailConfirmTest={props.emailConfirmTest}
        >
          <input
            type="text"
            className="inp_number"
            placeholder="인증번호 6자리"
            onChange={onChangeEmailConfirm}
            disabled={
              min === 0 && sec === 0
                ? true
                : emailConfirmDisable === true
                ? true
                : false
            }
            // mobileView={props.mobileView}
          />

          <span>
            {min}:{sec > 9 ? `${sec}` : `0${sec}`}
          </span>
        </Divcitation>

        <BtnEmailConfirmSend
          type="button"
          onClick={emailConfirm}
          emailConfirmBtn={emailConfirmBtn}
          disabled={
            min === 0 && sec === 0
              ? true
              : emailConfirmBtn === true
              ? true
              : false
          }
          min={min}
          sec={sec}
        >
          인증하기
        </BtnEmailConfirmSend>
      </div>
      {props.emailConfirmTest === null ? null : props.emailConfirmTest ? (
        <p style={{ color: "#476cd3" }}>인증번호가 일치합니다.</p>
      ) : (
        <p>인증번호가 일치하지 않습니다.</p>
      )}
    </>
  );
}
const BtnEmailConfirmSend = styled.button`
  cursor: ${(props) =>
    props.min === 0 && props.sec === 0
      ? "not-allowed"
      : props.emailConfirmBtn
      ? "not-allowed"
      : "pointer"};
`;

const Divcitation = styled.div`
  background-color: ${(props) =>
    props.min === 0 && props.sec === 0
      ? "#ebebeb"
      : props.emailConfirmTest === true
      ? "#ebebeb"
      : "#fff"};
`;
export default EmailConfirm;
