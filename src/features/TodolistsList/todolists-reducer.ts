import {
  ResponseStatuses,
  todolistsAPI,
  TodolistType,
} from "../../api/todolists-api";
import { RequestStatusType, setAppStatus } from "../../app/app-reducer";
import { AxiosError } from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasksTC } from "./tasks-reducer";
import { AppThunkType } from "../../app/store";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
// TYPES

const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    removeTodolist(state, action: PayloadAction<{ id: string }>) {
      // findind index of todolist to be removed
      const index = state.findIndex(
        (todolist) => todolist.id === action.payload.id
      );
      // if index was found
      if (index !== -1) {
        // delete 1 element from state starting at index
        state.splice(index, 1);
      }
    },
    addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
      // state.unshift() - adding to the beginning of state
      state.unshift({
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      });
    },
    changeTodolistTitle(
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) {
      const index = state.findIndex(
        (todolist) => todolist.id === action.payload.id
      );
      if (index !== -1) {
        state[index].title = action.payload.title;
      }
    },
    changeTodolistFilter(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) {
      const index = state.findIndex(
        (todolist) => todolist.id === action.payload.id
      );
      if (index !== -1) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{
        id: string;
        entityStatus: RequestStatusType;
      }>
    ) {
      const index = state.findIndex(
        (todolist) => todolist.id === action.payload.id
      );
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus;
      }
    },
    setTodolists(
      state,
      action: PayloadAction<{ todolists: Array<TodolistType> }>
    ) {
      return action.payload.todolists.map((todolist) => ({
        ...todolist,
        filter: "all",
        entityStatus: "idle",
      }));
    },
    clearTodolistsData(state) {
      return (state = initialState);
    },
  },
});

export const todolistsReducer = slice.reducer;
export const {
  changeTodolistEntityStatus,
  changeTodolistFilter,
  changeTodolistTitle,
  removeTodolist,
  setTodolists,
  addTodolist,
  clearTodolistsData,
} = slice.actions;

export const fetchTodolistsTC = (): AppThunkType => (dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  todolistsAPI
    .getTodolists()
    .then((res) => {
      dispatch(setTodolists({ todolists: res.data }));
      dispatch(setAppStatus({ status: "succeeded" }));
      // explicitly setting fetched todolists as resolved promise value
      return res.data;
    })
    .then((todolists) => {
      // forEach has no return value (undefined)
      todolists.forEach((todolist) => {
        dispatch(fetchTasksTC(todolist.id));
      });
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    });
};
export const removeTodolistTC = (id: string): AppThunkType => (dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  dispatch(changeTodolistEntityStatus({ id, entityStatus: "loading" })); // no need to change entityStatus later - todolist will be deleted
  todolistsAPI
    .deleteTodolist(id)
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.Success) {
        dispatch(removeTodolist({ id }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    });
};
export const changeTodolistTitleTC = (
  id: string,
  title: string
): AppThunkType => (dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  dispatch(changeTodolistEntityStatus({ id, entityStatus: "loading" }));
  todolistsAPI
    .updateTodolist(id, title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.Success) {
        dispatch(changeTodolistTitle({ id, title }));
        dispatch(setAppStatus({ status: "succeeded" }));
        dispatch(changeTodolistEntityStatus({ id, entityStatus: "succeeded" }));
      } else {
        handleServerAppError(dispatch, res.data);
        dispatch(changeTodolistEntityStatus({ id, entityStatus: "failed" }));
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    });
};
export const addTodolistTC = (title: string): AppThunkType => (dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  todolistsAPI
    .createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.Success) {
        dispatch(addTodolist({ todolist: res.data.data.item }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    });
};
// TCs
