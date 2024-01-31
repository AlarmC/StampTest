import "../styles/notice.css";
import Pagination from "react-js-pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const style = {
  marginTop: "2%",
  marginLeft: "38%",
  marginRight: "38%",
};
const style2 = {
  width: "200px",
  height: "45px",
};

export const Paging = ({ page, perPage, count, setPage }) => {
  return (
    <>
      <Pagination
        activePage={page}
        itemsCountPerPage={perPage}
        totalItemsCount={count}
        pageRangeDisplayed={4}
        prevPageText={"‹"}
        nextPageText={"›"}
        onChange={setPage}
      />
    </>
  );
};

export const SkeletonPaging = () => {
  return (
    <div style={style}>
      <Skeleton style={style2} />
    </div>
  );
};
