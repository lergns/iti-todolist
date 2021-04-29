import { FilterValuesType, ToDoListType } from "../App";
import { v1 } from "uuid";
// IMPORTS

export type RemoveToDoListActionType = {
  type: "REMOVE-TODOLIST";
  toDoListID: string;
};
export type AddToDoListActionType = {
  type: "ADD-TODOLIST";
  toDoListID: string;
  title: string;
};
type ChangeToDoListTitleActionType = {
  type: "CHANGE-TODOLIST-TITLE";
  toDoListID: string;
  changedTitle: string;
};
type ChangeToDoListFilterActionType = {
  type: "CHANGE-TODOLIST-FILTER";
  toDoListID: string;
  changedFilterValue: FilterValuesType;
};
type ActionTypes =
  | RemoveToDoListActionType
  | AddToDoListActionType
  | ChangeToDoListTitleActionType
  | ChangeToDoListFilterActionType;
// TYPES

export const removeToDoListAC = (
  toDoListID: string
): RemoveToDoListActionType => {
  return {
    type: "REMOVE-TODOLIST",
    toDoListID,
  };
};
export const addToDoListAC = (title: string): AddToDoListActionType => {
  return {
    type: "ADD-TODOLIST",
    toDoListID: v1(),
    title,
  };
};
export const changeToDoListTitleAC = (
  toDoListID: string,
  changedTitle: string
): ChangeToDoListTitleActionType => {
  return {
    type: "CHANGE-TODOLIST-TITLE",
    toDoListID,
    changedTitle,
  };
};
export const changeToDoListFilterAC = (
  toDoListID: string,
  changedFilterValue: FilterValuesType
): ChangeToDoListFilterActionType => {
  return {
    type: "CHANGE-TODOLIST-FILTER",
    toDoListID,
    changedFilterValue,
  };
};
// ACs

export const toDoListsReducer = (
  toDoListsState: Array<ToDoListType>,
  action: ActionTypes
): Array<ToDoListType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      const toDoListsCopy = [...toDoListsState];
      return toDoListsCopy.filter(
        (toDoList) => toDoList.id !== action.toDoListID
      );
    }
    case "ADD-TODOLIST":
      const newToDoList: ToDoListType = {
        id: action.toDoListID,
        title: action.title,
        filter: "all",
      };
      return [...toDoListsState, newToDoList];
    case "CHANGE-TODOLIST-TITLE": {
      const toDoListsCopy = [...toDoListsState];
      return toDoListsCopy.map((toDoList) =>
        toDoList.id === action.toDoListID
          ? {
              ...toDoList,
              title: action.changedTitle,
            }
          : toDoList
      );
    }
    case "CHANGE-TODOLIST-FILTER": {
      const toDoListsCopy = [...toDoListsState];
      return toDoListsCopy.map((toDoList) =>
        toDoList.id === action.toDoListID
          ? { ...toDoList, filter: action.changedFilterValue }
          : toDoList
      );
    }
    default:
      return toDoListsState;
  }
};
