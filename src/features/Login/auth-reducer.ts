import { setAppStatus } from "../../app/app-reducer";
import {
  authAPI,
  LoginParamsType,
  ResponseStatuses,
} from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTodolistsData } from "../TodolistsList/todolists-reducer";
import { AppThunkType } from "../../app/store";

const initialState = {
  isLoggedIn: false,
};

const slice = createSlice({
  // generated action type const's will "auth" as a prefix
  name: "auth",
  initialState,
  // reducers - analogue of switch cases in regular redux reducer
  reducers: {
    // setting type of action.payload
    setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      // updating state as if it was mutable - due to immerjs, setIsLoggedIn receives state "draft" instead of actual state and returns immutably-updated state  !
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  }, // default - return state - realised by redux toolkit behind the scenes !
});

export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;

export const loginTC = (data: LoginParamsType): AppThunkType => (dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.Success) {
        // passing object inside of AC call !
        dispatch(setIsLoggedIn({ isLoggedIn: true }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error);
    });
};
export const logoutTC = (): AppThunkType => (dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: false }));
        dispatch(setAppStatus({ status: "succeeded" }));
        dispatch(clearTodolistsData());
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error);
    });
};
// TCs
