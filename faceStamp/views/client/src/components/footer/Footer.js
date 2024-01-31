import logo from "../../assets/images/Logo.png";
import "./footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="footer_content">
          <div className="logo">
            <Link to="/" className="logo_anchor">
              <img src={logo} alt="logo" />
            </Link>
            <span>
              퓨너스는 다음 세대의 시간을 <br />
              가치있게 만들어 갑니다.
            </span>
          </div>
          <div className="info">
            <p>
              상담시간 09:30 - 18:30(평일) 12:00 -
              13:00(점심시간/토요일/일요일/공휴일 휴무)
            </p>
            <ul>
              <li>대표 남이준</li>
              <li>사업자등록번호 247-87-01405 [조회]</li>
              <li>통신판매업신고번호 제2020-서울금천-0382호</li>
              <li>이메일 funers@funers.com</li>
              <li>대표번호 02-6959-9909</li>
            </ul>
            <ul>
              <li>
                주소 서울특별시 금천구 가산디지털2로 123 (월드메르디앙 2차) 701,
                702호
              </li>
              <li>개인정보관리자 이슬</li>
            </ul>
            <div className="footer_list">
              <ul>
                <li>
                  <a href="#">사이트 이용약관</a>
                </li>
                <li>
                  <a href="#">개인정보 수집 및 이용</a>
                </li>
                <li>
                  <a href="#">개인정보 제공</a>
                </li>
                <li>
                  <a href="#">이용약관</a>
                </li>
                <li>
                  <a href="#">서비스 및 정산 정책</a>
                </li>
              </ul>
              <ul>
                <li>
                  <a href="#">YouTube</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">kakao</a>
                </li>
                <li>
                  <a href="#">facebook</a>
                </li>
                <li>
                  <a href="#">학습커뮤니티</a>
                </li>
              </ul>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
