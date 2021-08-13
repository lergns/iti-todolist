import { Dispatch } from "redux";
import {
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType,
} from "../../app/app-reducer";
import { authAPI, LoginParamsType } from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";

type ActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | SetAppStatusActionType
  | SetAppErrorActionType;
type InitialStateType = typeof initialState;
// TYPES

export const setIsLoggedInAC = (value: boolean) =>
  ({ type: "login/SET-IS-LOGGED-IN", value } as const);
// ACs

export const loginTC = (data: LoginParamsType) => (
  dispatch: Dispatch<ActionsType>
) => {
  dispatch(setAppStatusAC("loading"));
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error);
    });
};
export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((error) => {
      handleServerNetworkError(dispatch, error);
    });
};
// TCs

const initialState = {
  isLoggedIn: false,
};

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.value };

    default:
      return state;
  }
};
