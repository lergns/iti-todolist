import { Dispatch } from "redux";
import { ResponseType } from "../api/todolists-api";
import { setAppError, setAppStatus } from "../app/app-reducer";

export const handleServerNetworkError = (
  dispatch: Dispatch,
  errMessage: string
) => {
  dispatch(setAppError({ error: errMessage }));
  dispatch(setAppStatus({ status: "failed" }));
};

export const handleServerAppError = <T>(
  /* <T> - BEFORE arguments list === type of generic function - will be captured on generic function call ! T === TaskType when called from tasks-reducer.ts ; T === TodolistType when called from todolists-reducer.ts */
  dispatch: Dispatch,
  data: ResponseType<T>
) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }));
  } else {
    dispatch(setAppError({ error: "Error occurred" }));
  }
  dispatch(setAppStatus({ status: "failed" }));
};
