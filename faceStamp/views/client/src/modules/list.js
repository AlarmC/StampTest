import { createAction, handleActions } from "redux-actions";
import * as listAPI from "../lib/api/list";
import createRequestThunk from "../lib/api/createRequestThunk";

//도장 리스트 페이지 렌더링 되자마자 리스트 찾기
const GET_LIST = "list/GET_LIST";
const GET_LIST_SUCCESS = "list/GET_LIST_SUCCESS";

const SEND_LIST = "list/SEND_LIST";
const SEND_LIST_SUCCESS = "list/SEND_LIST_SUCCESS";

export const getList = createRequestThunk(GET_LIST, listAPI.getList);

export const sendList = createRequestThunk(SEND_LIST, listAPI.sendList);

const initialState = {
    list: null,
};

const list = handleActions(
    {
        [GET_LIST_SUCCESS]: (state, action) => ({
            ...state,
            list: action.payload.messageinfo.message,
        }),
        [SEND_LIST_SUCCESS]: (state, action) => ({
            ...state,
            list: action.payload.messageinfo.message,
        }),
    },
    initialState
);
  
export default list;