import { FilterValuesType, ToDoListType } from "../App";
import { v1 } from "uuid";
// IMPORTS

type RemoveToDoListActionType = {
  type: "REMOVE_TODOLIST";
  toDoListID: string;
};
type AddToDoListActionType = {
  type: "ADD_TODOLIST";
  title: string;
};
type ChangeToDoListTitleActionType = {
  type: "CHANGE_TODOLIST_TITLE";
  toDoListID: string;
  changedTitle: string;
};
type ChangeToDoListFilterActionType = {
  type: "CHANGE_TODOLIST_FILTER";
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
    type: "REMOVE_TODOLIST",
    toDoListID,
  };
};
export const addToDoListAC = (title: string): AddToDoListActionType => {
  return {
    type: "ADD_TODOLIST",
    title,
  };
};
export const changeToDoListTitleAC = (
  toDoListID: string,
  changedTitle: string
): ChangeToDoListTitleActionType => {
  return {
    type: "CHANGE_TODOLIST_TITLE",
    toDoListID,
    changedTitle,
  };
};
export const changeToDoListFilterAC = (
  toDoListID: string,
  changedFilterValue: FilterValuesType
): ChangeToDoListFilterActionType => {
  return {
    type: "CHANGE_TODOLIST_FILTER",
    toDoListID,
    changedFilterValue,
  };
};
// ACs

// reducer === pure function - immutability principle!
export const toDoListsReducer = (
  toDoLists: Array<ToDoListType>,
  action: ActionTypes
): Array<ToDoListType> => {
  // (initial state, action)
  switch (action.type) {
    case "REMOVE_TODOLIST":
      return toDoLists.filter((toDoList) => toDoList.id !== action.toDoListID);
    case "ADD_TODOLIST":
      const newToDoListID = v1();
      const newToDoList: ToDoListType = {
        id: newToDoListID,
        title: action.title,
        filter: "all",
      };
      return [...toDoLists, newToDoList];
    case "CHANGE_TODOLIST_TITLE":
      return toDoLists.map((toDoList) =>
        toDoList.id === action.toDoListID
          ? {
              ...toDoList,
              title: action.changedTitle,
            }
          : toDoList
      );
    case "CHANGE_TODOLIST_FILTER": {
      return toDoLists.map((toDoList) =>
        toDoList.id === action.toDoListID
          ? { ...toDoList, filter: action.changedFilterValue }
          : toDoList
      );
    }
    default:
      return toDoLists;
  }
};
