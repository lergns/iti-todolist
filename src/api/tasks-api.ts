import axios from "axios";

type TaskType = {
  description: string;
  title: string;
  status: number;
  priority: number;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdatedTaskType = {
  description: string;
  title: string;
  status: number;
  priority: number;
  startDate: string;
  deadline: string;
};

type GetTasksResponseType = {
  items: Array<TaskType>;
  totalCount: number;
  error: string;
};
type CommonResponseType<T = {}> = {
  data: T;
  resultCode: number;
  messages: Array<string>;
};

const axiosInstance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "264a0581-6cdc-4a28-9b7e-b8b5b1060aa0",
  },
});

export const tasksAPI = {
  getTasks(todolistId: string) {
    return axiosInstance.get<GetTasksResponseType>(
      `todo-lists/${todolistId}/tasks`
    );
  },
  createTask(todolistId: string, title: string) {
    return axiosInstance.post<CommonResponseType<{ item: TaskType }>>(
      `todo-lists/${todolistId}/tasks`,
      { title }
    );
  },
  deleteTask(todolistId: string, taskId: string) {
    return axiosInstance.delete<CommonResponseType>(
      `todo-lists/${todolistId}/tasks/${taskId}`
    );
  },
  updateTask(todolistId: string, taskId: string, updatedTask: UpdatedTaskType) {
    return axiosInstance.put<CommonResponseType<{ item: TaskType }>>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
      {
        ...updatedTask,
      }
    );
  },
};
