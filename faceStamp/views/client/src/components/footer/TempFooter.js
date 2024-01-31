import logo2 from "../../assets/images/logoImg.png"
import "./footer.css";
import { Link } from "react-router-dom";

function TempFooter() {
  return (
    <footer id="footer" style={{background:"white"}}>
      <div className="wrap">
        <div className="footer_content" style={{padding:"18px 80px 5px"}}>
          <div className="logo">
            <Link to="/" className="logo_anchor">
              <img src={logo2} alt="logo" />
            </Link>
          </div>
          <div className="info">
            <ul>
              <li>
              [28542] 충청북도 청주시 상당구 상당로 155 (북문로3가)
              </li>
              <li>대표전화 : 043-201-1300</li>
            </ul>
            <ul>
              <li>Copyright ⓒ Cheongju City. All Rights Reserved.</li>
            </ul>
            {/* </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default TempFooter;
