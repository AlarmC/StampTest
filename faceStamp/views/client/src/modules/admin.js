import { createAction, handleActions } from "redux-actions";
import createRequestThunk from "../lib/api/createRequestThunk";

const CHANGE_CONTENT = "admin/CHANGE_CONTENT"

const RESET_ITEM = 'admin/RESET_ITEM'

export const changeContent = createAction(CHANGE_CONTENT);

export const resetItemAdmin = createAction(RESET_ITEM);

const initialState = {
  content : null,
};

const admin = handleActions(
  {
    [CHANGE_CONTENT]: (state, action) => ({
      ...state,
      content : action.payload
    }),
  
    [RESET_ITEM]: (state) => ({
      ...state,
      content : null,
    }),
  },
  initialState
);

export default admin;
