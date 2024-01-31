import { createAction, handleActions } from "redux-actions";
import * as authAPI from "../lib/api/auth";
import createRequestThunk from "../lib/api/createRequestThunk";

//회원 가입
const REGISTER_USERS = "user/REGISTER_USERS";
const REGISTER_USERS_SUCCESS = "user/REGISTER_USERS_SUCCESS";

//로그인 후 유저정보 가져오기
const GET_USERS = "user/GET_USERS";
const GET_USERS_SUCCESS = "user/GET_USERS_SUCCESS";

//SNS 로그인 후 유저정보 가져오기
const GET_SNS_USERS = "user/GET_SNS_USERS";
const GET_SNS_USERS_SUCCESS = "user/GET_SNS_USERS_SUCCESS";

//유저 업데이트
const GET_UPDATE_USERS = "user/GET_UPDATE_USERS";
const GET_UPDATE_USERS_SUCCESS = "user/GET_UPDATE_USERS_SUCCESS";

// //유저 업데이트 후 불러오기
// const GET_UPDATEAFTER_USERS = "user/GET_UPDATEAFTER_USERS";
// const GET_UPDATEAFTER_USERS_SUCCESS = "user/GET_UPDATEAFTER_USERS_SUCCESS";

//유저 업데이트 후 OK 시
const GET_UPDATE_OK = "user/GET_UPDATE_OK";

//새로고침 이후 임시 로그인 처리
const TEMP_SET_USER = "user/TEMP_SET_USER";

//로그아웃
const LOGOUT = "user/LOGIUT";

export const signUp = createRequestThunk(REGISTER_USERS, authAPI.signUp);
export const getUsers = createRequestThunk(GET_USERS, authAPI.login);
export const getSnsUsers = createRequestThunk(GET_SNS_USERS, authAPI.snslogin);
export const getUpdate = createRequestThunk(
  GET_UPDATE_USERS,
  authAPI.updateUsers
);
export const updateok = createAction(GET_UPDATE_OK);

// export const getSelectUser = createRequestThunk(
//   GET_UPDATEAFTER_USERS,
//   authAPI.getSelectUser
// );

export const tempSetUser = createAction(TEMP_SET_USER, (user) => user);
export const logout = createAction(LOGOUT);

const initialState = {
  user: null,
};

const user = handleActions(
  {
    [REGISTER_USERS_SUCCESS]: (state, action) => ({
      ...state,
      user: action.payload.messageinfo.message,
    }),
    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      user: action.payload.messageinfo.message,
    }),
    [GET_SNS_USERS_SUCCESS]: (state, action) => ({
      ...state,
      user: action.payload.messageinfo.message,
    }),
    [GET_UPDATE_USERS_SUCCESS]: (state, action) => ({
      ...state,
      user: action.payload.messageinfo.message,
    }),
    [GET_UPDATE_OK]: (state, action) => ({
      ...state,
      user: action.payload,
    }),
    // [GET_UPDATEAFTER_USERS_SUCCESS]: (state, action) => ({
    //   ...state,
    //   user: action.payload.messageinfo.message,
    // }),
    [TEMP_SET_USER]: (state, action) => ({
      ...state,
      user: action.payload,
    }),
    [LOGOUT]: (state) => ({
      ...state,
      user: null,
    }),
  },
  initialState
);

export default user;
