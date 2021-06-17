import { TasksStateType } from "../App";
import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  SetTodolistsActionType,
} from "./todolists-reducer";
import { TaskStatuses, TaskType, todolistsAPI } from "../api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "./store";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>;
export type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
export type SetTasksActionType = ReturnType<typeof setTasksAC>;
type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodolistActionType
  | SetTodolistsActionType
  | SetTasksActionType
  | RemoveTodolistActionType;

export const removeTaskAC = (taskId: string, todolistId: string) =>
  ({ type: "REMOVE-TASK", taskId: taskId, todolistId: todolistId } as const);

export const addTaskAC = (task: TaskType) =>
  ({ type: "ADD-TASK", task } as const);

export const changeTaskStatusAC = (
  taskId: string,
  status: TaskStatuses,
  todolistId: string
) =>
  ({
    type: "CHANGE-TASK-STATUS",
    status,
    todolistId,
    taskId,
  } as const);

export const changeTaskTitleAC = (
  taskId: string,
  title: string,
  todolistId: string
) =>
  ({
    type: "CHANGE-TASK-TITLE",
    title,
    todolistId,
    taskId,
  } as const);

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({ type: "SET-TASKS", tasks, todolistId } as const);
// ACs

export const fetchTasksTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    todolistsAPI.getTasks(todolistId).then((res) => {
      dispatch(setTasksAC(res.data.items, todolistId));
    });
  };
};

export const removeTaskTC = (taskId: string, todolistId: string) => (
  dispatch: Dispatch
) => {
  todolistsAPI
    .deleteTask(todolistId, taskId)
    .then(() => dispatch(removeTaskAC(taskId, todolistId)));
};

export const addTaskTC = (todolistId: string, taskTitle: string) => (
  dispatch: Dispatch
) => {
  todolistsAPI.createTask(todolistId, taskTitle).then((res) => {
    dispatch(addTaskAC(res.data.data.item));
  });
};

export const updateTaskStatusTC = (
  taskId: string,
  todolistId: string,
  status: TaskStatuses
) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
  const allTasksFromState = getState().tasks;
  const tasksForCurrentTodolist = allTasksFromState[todolistId];
  const task = tasksForCurrentTodolist.find((t) => {
    return t.id === taskId;
  });

  if (task) {
    todolistsAPI
      .updateTask(todolistId, taskId, {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: status,
      })
      .then(() => {
        dispatch(changeTaskStatusAC(taskId, status, todolistId));
      });
  }
};

export const updateTaskTitleTC = (
  taskId: string,
  todolistId: string,
  title: string
) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
  const allTasksFromState = getState().tasks;
  const tasksForCurrentTodolist = allTasksFromState[todolistId];
  const task = tasksForCurrentTodolist.find((t) => {
    return t.id === taskId;
  });

  if (task) {
    todolistsAPI
      .updateTask(todolistId, taskId, {
        title: title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
      })
      .then(() => {
        dispatch(changeTaskTitleAC(taskId, title, todolistId));
      });
  }
};
// TCs

const initialState: TasksStateType = {};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionsType
): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      const stateCopy = { ...state };
      const tasks = stateCopy[action.todolistId];
      const newTasks = tasks.filter((t) => t.id !== action.taskId);
      stateCopy[action.todolistId] = newTasks;
      return stateCopy;
    }

    case "ADD-TASK": {
      const stateCopy = { ...state };
      const tasks = stateCopy[action.task.todoListId];
      const newTasks = [action.task, ...tasks];
      stateCopy[action.task.todoListId] = newTasks;
      return stateCopy;
    }

    case "CHANGE-TASK-STATUS": {
      let todolistTasks = state[action.todolistId];
      let newTasksArray = todolistTasks.map((t) =>
        t.id === action.taskId ? { ...t, status: action.status } : t
      );

      state[action.todolistId] = newTasksArray;
      return { ...state };
    }
    case "CHANGE-TASK-TITLE": {
      let todolistTasks = state[action.todolistId];
      // найдём нужную таску:
      let newTasksArray = todolistTasks.map((t) =>
        t.id === action.taskId ? { ...t, title: action.title } : t
      );

      state[action.todolistId] = newTasksArray;
      return { ...state };
    }
    case "ADD-TODOLIST": {
      return {
        ...state,
        [action.todolistId]: [],
      };
    }
    case "REMOVE-TODOLIST": {
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;
    }

    case "SET-TODOLISTS": {
      const stateCopy = { ...state };
      action.todolists.forEach((todolist) => {
        stateCopy[todolist.id] = [];
      });
      return stateCopy;
    }

    case "SET-TASKS": {
      const stateCopy = { ...state };
      stateCopy[action.todolistId] = action.tasks;
      return stateCopy;
    }

    default:
      return state;
  }
};
