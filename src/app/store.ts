import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import { todolistsReducer } from "../features/TodolistsList/todolists-reducer";
import { combineReducers } from "redux";
import thunkMiddleware, { ThunkAction } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "../features/Login/auth-reducer";
import { configureStore, Action } from "@reduxjs/toolkit";

export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppThunkType = ThunkAction<
  void,
  AppRootStateType,
  unknown,
  Action<string>
>;

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(thunkMiddleware),
});

// @ts-ignore
window.store = store;
