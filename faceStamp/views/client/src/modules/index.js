import { combineReducers } from "redux";
import user from "./user";
import dotinfo from "./dotInfo";
import list from "./list";


const rootReducer = combineReducers({
  user,
  dotinfo,
  list,
});

export default rootReducer;
