import styled from "styled-components";
import Spinner from "../../assets/images/Spinner-1s-200px.gif";
function SpinnerClass({ spinnerView }) {
  return (
    <Background spinnerView={spinnerView}>
      <SpinnerCon spinnerView={spinnerView}>
        <img src={Spinner} alt="로딩중" width="10%" />
        <LoadingText>잠시만 기다려 주세요.</LoadingText>
      </SpinnerCon>
    </Background>
  );
}
const Background = styled.div`
  display: ${(props) => (props.spinnerView ? "block" : "none")};
`;
const SpinnerCon = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #f4f4f4b7;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.div`
  text-align: center;
  font-weight: 700;
`;
export default SpinnerClass;
