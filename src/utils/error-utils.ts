import { setAppErrorAC, setAppStatusAC } from "../app/app-reducer";
import { Dispatch } from "redux";
import {
  SetAppErrorActionType,
  SetAppStatusActionType,
} from "../features/TodolistsList/tasks-reducer";
import { ResponseType } from "../api/todolists-api"; // imported NOT from TS library !

type ErrorUtilsDispatchType = Dispatch<
  SetAppErrorActionType | SetAppStatusActionType
>;

export const handleServerNetworkError = (
  dispatch: ErrorUtilsDispatchType,
  errMessage: string
) => {
  dispatch(setAppErrorAC(errMessage));
  dispatch(setAppStatusAC("failed"));
};

export const handleServerAppError = <T>(
  /* <T> - BEFORE arguments list === type of generic function - will be captured on generic function call ! T === TaskType when called from tasks-reducer.ts ; T === TodolistType when called from todolists-reducer.ts */
  dispatch: ErrorUtilsDispatchType,
  data: ResponseType<T>
) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]));
  } else {
    dispatch(setAppErrorAC("Error occurred"));
  }
  dispatch(setAppStatusAC("failed"));
};
