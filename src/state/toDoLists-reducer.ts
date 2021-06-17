import { todolistsAPI, TodolistType } from "../api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "./store";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type ChangeTodolistTitleActionType = ReturnType<
  typeof changeTodolistTitleAC
>;
export type ChangeTodolistFilterActionType = ReturnType<
  typeof changeTodolistFilterAC
>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | SetTodolistsActionType
  | ChangeTodolistFilterActionType;
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
};

export const removeTodolistAC = (todolistId: string) =>
  ({ type: "REMOVE-TODOLIST", id: todolistId } as const);

export const addTodolistAC = (title: string, todolistId: string) =>
  ({ type: "ADD-TODOLIST", title, todolistId } as const);

export const changeTodolistTitleAC = (id: string, title: string) =>
  ({ type: "CHANGE-TODOLIST-TITLE", id: id, title: title } as const);

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
  ({ type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter } as const);

export const setTodolistsAC = (todolists: Array<TodolistType>) =>
  ({ type: "SET-TODOLISTS", todolists } as const);
// ACs

export const fetchTodolistsTC = () => (
  dispatch: Dispatch,
  getState: () => AppRootStateType
): void => {
  todolistsAPI.getTodolists().then((res) => {
    dispatch(setTodolistsAC(res.data));
  });
};
export const updateTodolistTitleTC = (id: string, title: string) => (
  dispatch: Dispatch
) => {
  todolistsAPI.updateTodolist(id, title).then((res) => {
    dispatch(changeTodolistTitleAC(id, title));
  });
};
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  todolistsAPI.createTodolist(title).then((res) => {
    dispatch(addTodolistAC(title, res.data.data.item.id));
  });
};
export const removeTodolistTC = (id: string) => (dispatch: Dispatch) => {
  todolistsAPI.deleteTodolist(id).then((res) => {
    dispatch(removeTodolistAC(id));
  });
};
// TCs

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsType
): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.id);
    }
    case "ADD-TODOLIST": {
      return [
        {
          id: action.todolistId,
          title: action.title,
          filter: "all",
          addedDate: "",
          order: 0,
        },
        ...state,
      ];
    }
    case "CHANGE-TODOLIST-TITLE": {
      const todolist = state.find((tl) => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.title = action.title;
      }
      return [...state];
    }
    case "CHANGE-TODOLIST-FILTER": {
      const todolist = state.find((tl) => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.filter = action.filter;
      }
      return [...state];
    }

    case "SET-TODOLISTS": {
      return action.todolists.map((todolist) => {
        return { ...todolist, filter: "all" };
      });
    }

    default:
      return state;
  }
};
