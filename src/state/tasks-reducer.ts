import { TasksStateType, TaskType } from "../App";
import { v1 } from "uuid";
import {
  AddToDoListActionType,
  RemoveToDoListActionType,
} from "./toDoLists-reducer";
// IMPORTS

type RemoveTaskActionType = {
  type: "REMOVE-TASK";
  toDoListID: string;
  taskID: string;
};
type AddTaskActionType = {
  type: "ADD-TASK";
  toDoListID: string;
  title: string;
};
type ChangeTaskStatusActionType = {
  type: "CHANGE-TASK-STATUS";
  toDoListID: string;
  taskID: string;
  newIsDoneValue: boolean;
};
type ChangeTaskTitleActionType = {
  type: "CHANGE-TASK-TITLE";
  toDoListID: string;
  taskID: string;
  changedTitle: string;
};
type ActionTypes =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddToDoListActionType
  | RemoveToDoListActionType; // importing from toDoLists-reducer.ts
// TYPES

export const removeTaskAC = (
  toDoListID: string,
  taskID: string
): RemoveTaskActionType => {
  return {
    type: "REMOVE-TASK",
    toDoListID,
    taskID,
  };
};
export const addTaskAC = (
  toDoListID: string,
  title: string
): AddTaskActionType => {
  return {
    type: "ADD-TASK",
    toDoListID,
    title,
  };
};
export const changeTaskStatusAC = (
  toDoListID: string,
  taskID: string,
  newIsDoneValue: boolean
): ChangeTaskStatusActionType => {
  return {
    type: "CHANGE-TASK-STATUS",
    toDoListID,
    taskID,
    newIsDoneValue,
  };
};
export const changeTaskTitleAC = (
  toDoListID: string,
  taskID: string,
  changedTitle: string
): ChangeTaskTitleActionType => {
  return {
    type: "CHANGE-TASK-TITLE",
    toDoListID,
    taskID,
    changedTitle,
  };
};
// ACs

export const tasksReducer = (
  tasksState: TasksStateType,
  action: ActionTypes
): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      const tasksCopy = { ...tasksState }; // NOT working with tasksState directly
      // referencing associative array's property with [] notation
      tasksCopy[action.toDoListID] = tasksCopy[action.toDoListID].filter(
        (task) => task.id !== action.taskID
      );
      return tasksCopy;
    }
    case "ADD-TASK":
      const newTask: TaskType = {
        id: v1(),
        title: action.title,
        isDone: false,
      };
      return {
        ...tasksState,
        [action.toDoListID]: [newTask, ...tasksState[action.toDoListID]],
      };
    case "CHANGE-TASK-STATUS": {
      const tasksCopy = { ...tasksState };
      const checkedTasks = tasksCopy[action.toDoListID].map((task) =>
        task.id === action.taskID
          ? { ...task, isDone: action.newIsDoneValue }
          : task
      );
      return { ...tasksState, [action.toDoListID]: checkedTasks };
    }
    case "CHANGE-TASK-TITLE": {
      const tasksCopy = { ...tasksState };
      const changedTasks = tasksCopy[action.toDoListID].map((task) =>
        task.id === action.taskID
          ? { ...task, title: action.changedTitle }
          : task
      );
      return { ...tasksState, [action.toDoListID]: changedTasks };
    }
    case "ADD-TODOLIST":
      return { ...tasksState, [action.toDoListID]: [] };
    case "REMOVE-TODOLIST": {
      const tasksCopy = { ...tasksState };
      delete tasksCopy[action.toDoListID];
      return tasksCopy;
    } // "ADD-TODOLIST" and "REMOVE-TODOLIST" - same actions used in different reducers (toDoLists-reducer and tasks-reducer)
    default:
      return tasksState;
  }
};