import "../styles/MyPage.css";
import Pagination from "react-js-pagination";

const Paging = ({ page, perPage, count, setPage }) => {
  return (
    <Pagination
      activePage={page} //현재페이지
      itemsCountPerPage={perPage} // 한페이지당 보여줄 리스트 아이템의 개수
      totalItemsCount={count} //총 아이템 개수
      // pageRangeDisplayed={0} //범위
      prevPageText={"‹"}
      nextPageText={"›"}
      onChange={setPage}
    />
  );
};

export default Paging;
