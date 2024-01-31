import { createAction, handleActions } from "redux-actions";


const INSERT_DOTINFO = "dotinfo/INSERT_DOTINFO";
const TEMP_SET_DOTINFO = "dotinfo/TEMP_SET_DOTINFO";

export const insert_dotinfo = createAction(INSERT_DOTINFO);

export const tempSetDotinfo = createAction(TEMP_SET_DOTINFO, (dotinfo) => dotinfo);

const initialState = {
  dotinfo: [],
};

const dotinfo = handleActions(
  {
    [INSERT_DOTINFO]: (state, action) => {
      // INSERT_DETECT 액션 처리 로직 작성
      // state를 업데이트하고 싶은 내용에 맞게 변경
      return {
        ...state,
        dotinfo: action.payload,
      };
    },
    [TEMP_SET_DOTINFO]: (state, action) => {
      return {
        ...state,
        dotinfo: action.payload,
      };
    },
  },
  initialState
);

export default dotinfo;