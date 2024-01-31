import styled from "styled-components";
import Spinner from "../../assets/images/Eclipse-1s-200px.gif";

function SpinnerDetail({ spinnerView }) {
  return (
    <Background spinnerView={spinnerView}>
      <SpinnerCon spinnerView={spinnerView}>
        <img src={Spinner} alt="로딩중" width="10%" />
        {/* <LoadingText>잠시만 기다려 주세요.</LoadingText> */}
      </SpinnerCon>
    </Background>
  );
}

const Background = styled.div`
  // display: ${(props) => (props.spinnerView ? "block" : "none")};
  display: block;
  width: 100%;
  min-height: 1000px;

  position: absolute;
  top: 0;
  left: 0;
  //   background-color: red;
`;
const SpinnerCon = styled.div`
  // position: fixed;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  //   background: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default SpinnerDetail;
