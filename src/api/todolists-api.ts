import axios from "axios";
import { RequestStatusType } from "../app/app-reducer";

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};
export type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  data: D;
};

export enum TaskStatuses {
  Active = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  High = 2,
  Urgent = 3,
  Irrelevant = 4,
}

export enum ResponseStatuses {
  Success = 0,
  Error = 1,
  Captcha = 10,
}

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
  entityStatus: RequestStatusType;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};
type GetAuthMeDataType = {
  id: number;
  email: string;
  login: string;
};
// TYPES

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "264a0581-6cdc-4a28-9b7e-b8b5b1060aa0",
  },
});

export const authAPI = {
  me() {
    return instance.get<ResponseType<GetAuthMeDataType>>("auth/me");
  },
  login(loginParams: LoginParamsType) {
    return instance.post<ResponseType<{ userId?: number }>>(
      "auth/login",
      loginParams
    );
  },
  logout() {
    return instance.delete<ResponseType>("auth/login");
  },
};

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", {
      title: title,
    });
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${id}`, {
      title: title,
    });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(
      `todo-lists/${todolistId}/tasks/${taskId}`
    );
  },
  createTask(todolistId: string, taskTitile: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(
      `todo-lists/${todolistId}/tasks`,
      { title: taskTitile }
    );
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<TaskType>>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
      model
    );
  },
};
