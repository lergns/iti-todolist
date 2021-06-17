import { todolistsAPI, TodolistType } from "../../api/todolists-api";
import { Dispatch } from "redux";
import {
  RequestStatusType,
  setAppErrorAC,
  setAppStatusAC,
} from "../../app/app-reducer";
import { AxiosError } from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
// IMPORTS

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppErrorAC>
  | ReturnType<typeof changeTodolistEntityStatusAC>
  | SetTodolistsActionType;
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
// TYPES

export const removeTodolistAC = (id: string) =>
  ({ type: "REMOVE-TODOLIST", id } as const);
export const addTodolistAC = (todolist: TodolistType) =>
  ({ type: "ADD-TODOLIST", todolist } as const);
export const changeTodolistTitleAC = (id: string, title: string) =>
  ({
    type: "CHANGE-TODOLIST-TITLE",
    id,
    title,
  } as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
  ({
    type: "CHANGE-TODOLIST-FILTER",
    id,
    filter,
  } as const);
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
  ({ type: "SET-TODOLISTS", todolists } as const);
export const changeTodolistEntityStatusAC = (
  id: string,
  entityStatus: RequestStatusType
) =>
  ({
    type: "CHANGE-TODOLIST-ENTITY-STATUS",
    id,
    entityStatus,
  } as const);
// ACs

// enum - object of const's
export enum ResponseStatuses {
  success = 0,
  error = 1,
  captcha = 10,
}

export const fetchTodolistsTC = () => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC(res.data));
        dispatch(setAppStatusAC("succeeded"));
      })
      .catch((err: AxiosError) => {
        handleServerNetworkError(dispatch, err.message);
      });
  };
};
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"));
    dispatch(changeTodolistEntityStatusAC(todolistId, "loading")); // no need to change entityStatus later - todolist will be deleted
    todolistsAPI
      .deleteTodolist(todolistId)
      .then((res) => {
        if (res.data.resultCode === ResponseStatuses.success) {
          dispatch(removeTodolistAC(todolistId));
          dispatch(setAppStatusAC("succeeded"));
        } else {
          handleServerAppError(dispatch, res.data);
        }
      })
      .catch((err: AxiosError) => {
        handleServerNetworkError(dispatch, err.message);
      });
  };
};
export const addTodolistTC = (title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"));
    todolistsAPI
      .createTodolist(title)
      .then((res) => {
        if (res.data.resultCode === ResponseStatuses.success) {
          dispatch(addTodolistAC(res.data.data.item));
          dispatch(setAppStatusAC("succeeded"));
        } else {
          handleServerAppError(dispatch, res.data);
        }
      })
      .catch((err: AxiosError) => {
        handleServerNetworkError(dispatch, err.message);
      });
  };
};
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"));
    todolistsAPI
      .updateTodolist(id, title)
      .then((res) => {
        if (res.data.resultCode === ResponseStatuses.success) {
          dispatch(changeTodolistTitleAC(id, title));
          dispatch(setAppStatusAC("succeeded"));
        } else {
          handleServerAppError(dispatch, res.data);
        }
      })
      .catch((err: AxiosError) => {
        handleServerNetworkError(dispatch, err.message);
      });
  };
};
// TCs

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsType
): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.id);

    case "ADD-TODOLIST":
      return [
        { ...action.todolist, filter: "all", entityStatus: "idle" },
        ...state,
      ];

    case "CHANGE-TODOLIST-TITLE":
      return state.map((tl) =>
        tl.id === action.id ? { ...tl, title: action.title } : tl
      );

    case "CHANGE-TODOLIST-FILTER":
      return state.map((tl) =>
        tl.id === action.id ? { ...tl, filter: action.filter } : tl
      );

    case "SET-TODOLISTS":
      return action.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));

    case "CHANGE-TODOLIST-ENTITY-STATUS":
      return state.map((tl) =>
        tl.id === action.id ? { ...tl, entityStatus: action.entityStatus } : tl
      );

    default:
      return state;
  }
};
