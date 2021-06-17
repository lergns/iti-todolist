import axios from "axios";

type ToDoListType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};
type CommonResponseType<T = {}> = {
  // <T = {}> - if <T> is not set explicitly, its default value === {}
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: Array<string>;
  data: T; // T === "Type"
};

const axiosInstance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/", // endpoints shouldn't be added to baseURL
  withCredentials: true,
  headers: {
    "API-KEY": "264a0581-6cdc-4a28-9b7e-b8b5b1060aa0",
  },
});

export const toDoListAPI = {
  getToDos() {
    // .get<RETURN TYPE>
    return axiosInstance.get<Array<ToDoListType>>("todo-lists");
  },
  createToDo(title: string) {
    return axiosInstance.post<CommonResponseType<{ item: ToDoListType }>>(
      "todo-lists",
      { title }
    );
  },
  deleteToDo(todolistId: string) {
    return axiosInstance.delete<CommonResponseType>(`todo-lists/${todolistId}`);
  },
  updateToDoTitle(todolistId: string, title: string) {
    return axiosInstance.put<CommonResponseType>(`todo-lists/${todolistId}`, {
      title,
    });
  },
};
