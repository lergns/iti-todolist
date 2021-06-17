import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  ResponseStatuses,
  SetTodolistsActionType,
} from "./todolists-reducer";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "../../api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "../../app/store";
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

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
type ActionsType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof changeTaskEntityStatusAC>
  | SetAppStatusActionType
  | SetAppErrorActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistsActionType
  | ReturnType<typeof setTasksAC>;
// TYPES

export const removeTaskAC = (taskId: string, todolistId: string) =>
  ({ type: "REMOVE-TASK", taskId, todolistId } as const);
export const addTaskAC = (task: TaskType) =>
  ({ type: "ADD-TASK", task } as const);
export const updateTaskAC = (
  taskId: string,
  model: UpdateDomainTaskModelType,
  todolistId: string
) => ({ type: "UPDATE-TASK", model, todolistId, taskId } as const);
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({ type: "SET-TASKS", tasks, todolistId } as const);
export const changeTaskEntityStatusAC = (
  todolistId: string,
  id: string,
  entityStatus: RequestStatusType
) =>
  ({
    type: "CHANGE-TASK-ENTITY-STATUS",
    todolistId,
    id,
    entityStatus,
  } as const);
// ACs

export const fetchTasksTC = (todolistId: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  dispatch(setAppStatusAC("loading"));
  todolistsAPI
    .getTasks(todolistId)
    .then((res) => {
      if (!res.data.error) {
        dispatch(setTasksAC(res.data.items, todolistId));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        dispatch(setAppErrorAC("Error occurred"));
        dispatch(setAppStatusAC("failed"));
      }
    })
    .catch((err: AxiosError) => {
      // err: AxiosError - type for errors returned by axios
      handleServerNetworkError(dispatch, err.message);
    });
};
export const removeTaskTC = (taskId: string, todolistId: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  dispatch(setAppStatusAC("loading"));
  dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"));
  todolistsAPI
    .deleteTask(todolistId, taskId)
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.success) {
        dispatch(removeTaskAC(taskId, todolistId));
        dispatch(setAppStatusAC("succeeded"));
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "succeeded"));
      } else {
        handleServerAppError(dispatch, res.data);
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "failed"));
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    });
};
export const addTaskTC = (title: string, todolistId: string) => (
  dispatch: Dispatch<ActionsType>
) => {
  dispatch(setAppStatusAC("loading"));
  todolistsAPI
    .createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.success) {
        dispatch(addTaskAC(res.data.data.item));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(dispatch, res.data);
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    });
};
export const updateTaskTC = (
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistId: string
) => (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
  const state = getState();
  const task = state.tasks[todolistId].find((t) => t.id === taskId);
  if (!task) {
    //throw new Error("task not found in the state");
    console.warn("task not found in the state");
    return;
  }

  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...domainModel,
  };

  dispatch(setAppStatusAC("loading"));
  dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"));
  todolistsAPI
    .updateTask(todolistId, taskId, apiModel)
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.success) {
        dispatch(updateTaskAC(taskId, domainModel, todolistId));
        dispatch(setAppStatusAC("succeeded"));
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "succeeded"));
      } else {
        handleServerAppError(dispatch, res.data);
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, "failed"));
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    });
};
// TCs

const initialState: TasksStateType = {};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionsType
): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          (t) => t.id !== action.taskId
        ),
      };

    case "ADD-TASK":
      return {
        ...state,
        [action.task.todoListId]: [
          action.task,
          ...state[action.task.todoListId],
        ],
      };

    case "UPDATE-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, ...action.model } : t
        ),
      };

    case "ADD-TODOLIST":
      return { ...state, [action.todolist.id]: [] };

    case "REMOVE-TODOLIST":
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;

    case "SET-TODOLISTS": {
      const copyState = { ...state };
      action.todolists.forEach((tl) => {
        copyState[tl.id] = [];
      });
      return copyState;
    }

    case "SET-TASKS":
      return { ...state, [action.todolistId]: action.tasks };

    case "CHANGE-TASK-ENTITY-STATUS":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.id ? { ...t, entityStatus: action.entityStatus } : t
        ),
      };

    default:
      return state;
  }
};
