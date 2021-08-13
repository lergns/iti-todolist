import { handleServerNetworkError } from "../utils/error-utils";
import { setIsLoggedInAC } from "../features/Login/auth-reducer";
import { authAPI } from "../api/todolists-api";
import { Dispatch } from "redux";
// IMPORTS

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"; // if "loading" - show Preloader
export type ErrorType = string | null;
type ActionsType =
  | SetAppErrorActionType
  | SetAppStatusActionType
  | SetIsInitializedActionType;
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetIsInitializedActionType = ReturnType<typeof setIsInitializedAC>;
type InitialStateType = typeof initialState;
// TYPES

export const setAppStatusAC = (status: RequestStatusType) =>
  ({
    type: "APP/SET-STATUS",
    status,
  } as const);
export const setAppErrorAC = (error: ErrorType) =>
  ({
    type: "APP/SET-ERROR",
    error,
  } as const);
export const setIsInitializedAC = (isInitialized: boolean) =>
  ({ type: "APP/SET-IS-INITIALIZED", isInitialized } as const);
// ACs

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error);
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true)); // using .finally() since after receiving response from authAPI.me() isInitialized should === true regardless of promise state !
    });
};
// TCs

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as ErrorType,
  isInitialized: false,
};

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };

    case "APP/SET-ERROR":
      return { ...state, error: action.error };

    case "APP/SET-IS-INITIALIZED":
      return { ...state, isInitialized: action.isInitialized };

    default:
      return state;
  }
};
