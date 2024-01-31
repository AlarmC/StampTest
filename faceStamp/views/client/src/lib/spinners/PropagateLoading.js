import PropagateLoader from "react-spinners/PropagateLoader";
import "../../styles/default.css";
function PropagateLoading({ propagate }) {
  return (
    <div
      className="propagate-fixed"
      style={{ display: propagate ? "block" : "none" }}
    >
      <div className="propagate-background">
        <div className="propagate_div">
          {/* <div>잠시만 기다려 주세요.</div> */}
          <PropagateLoader color="rgba(114, 199, 225, 1)" size={40} />
        </div>
      </div>
    </div>
  );
}

export default PropagateLoading;
