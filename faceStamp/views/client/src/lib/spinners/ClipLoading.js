import ClipLoader from "react-spinners/ClipLoader";

function ClipLoading() {
  return (
    <div className="sweet-loading">
      <div className="loading_div">
        <ClipLoader color="rgb(52,152,219)" size={130} />
      </div>
    </div>
  );
}

export default ClipLoading;
