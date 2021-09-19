import { handleServerNetworkError } from "../utils/error-utils";
import { setIsLoggedIn } from "../features/Login/auth-reducer";
import { authAPI, ResponseStatuses } from "../api/todolists-api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunkType } from "./store";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"; // if "loading" - show Preloader
export type ErrorType = string | null;
export type AppInitialStateType = typeof initialState;
// TYPES

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as ErrorType,
  isInitialized: false,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setAppError(state, action: PayloadAction<{ error: ErrorType }>) {
      state.error = action.payload.error;
    },
    setIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppStatus, setAppError, setIsInitialized } = slice.actions;

export const initializeAppTC = (): AppThunkType => (dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }));
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error);
    })
    .finally(() => {
      dispatch(setIsInitialized({ isInitialized: true }));
    });
};
// TCs
