import {
  ResponseStatuses,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "../../api/todolists-api";
import { AppRootStateType, AppThunkType } from "../../app/store";
import {
  RequestStatusType,
  setAppError,
  setAppStatus,
} from "../../app/app-reducer";
import { AxiosError } from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addTodolist,
  clearTodolistsData,
  removeTodolist,
  setTodolists,
} from "./todolists-reducer";

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
// TYPES

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    removeTask(
      state,
      action: PayloadAction<{ taskId: string; todolistId: string }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(
        (task) => task.id === action.payload.taskId
      );
      if (index !== -1) {
        tasks.splice(index, 1);
      }
    },
    addTask(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task);
    },
    updateTask(
      state,
      action: PayloadAction<{
        taskId: string;
        model: UpdateDomainTaskModelType;
        todolistId: string;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(
        (task) => task.id === action.payload.taskId
      );
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model };
      }
    },
    changeTaskEntityStatus(
      state,
      action: PayloadAction<{
        todolistId: string;
        taskId: string;
        entityStatus: RequestStatusType;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(
        (task) => task.id === action.payload.taskId
      );
      if (index !== -1) {
        tasks[index].entityStatus = action.payload.entityStatus;
      }
    },
    setTasks(
      state,
      action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>
    ) {
      state[action.payload.todolistId] = action.payload.tasks;
    },
  },
  extraReducers(builder) {
    builder.addCase(addTodolist, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(removeTodolist, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(setTodolists, (state, action) => {
      action.payload.todolists.forEach((todolist) => {
        state[todolist.id] = [];
      });
    });
    builder.addCase(clearTodolistsData, (state) => {
      return (state = {} as TasksStateType);
    });
  }, // reducers/ACs imported from another reducer
});

export const tasksReducer = slice.reducer;
export const {
  changeTaskEntityStatus,
  removeTask,
  setTasks,
  addTask,
  updateTask,
} = slice.actions;

export const fetchTasksTC = (todolistId: string): AppThunkType => (
  dispatch
) => {
  dispatch(setAppStatus({ status: "loading" }));
  todolistsAPI
    .getTasks(todolistId)
    .then((res) => {
      if (!res.data.error) {
        dispatch(setTasks({ tasks: res.data.items, todolistId }));
        dispatch(setAppStatus({ status: "succeeded" }));
      } else {
        dispatch(setAppError({ error: "Error occurred" }));
        dispatch(setAppStatus({ status: "failed" }));
      }
    })
    .catch((err: AxiosError) => {
      // err: AxiosError - type for errors returned by axios
      handleServerNetworkError(dispatch, err.message);
    });
};
export const removeTaskTC = (
  taskId: string,
  todolistId: string
): AppThunkType => (dispatch) => {
  dispatch(setAppStatus({ status: "loading" }));
  dispatch(
    changeTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" })
  );
  todolistsAPI
    .deleteTask(todolistId, taskId)
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.Success) {
        dispatch(removeTask({ taskId, todolistId }));
        dispatch(setAppStatus({ status: "succeeded" }));
        dispatch(
          changeTaskEntityStatus({
            todolistId,
            taskId,
            entityStatus: "succeeded",
          })
        );
      } else {
        handleServerAppError(dispatch, res.data);
        dispatch(
          changeTaskEntityStatus({ todolistId, taskId, entityStatus: "failed" })
        );
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    });
};
export const addTaskTC = (title: string, todolistId: string): AppThunkType => (
  dispatch
) => {
  dispatch(setAppStatus({ status: "loading" }));
  todolistsAPI
    .createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.Success) {
        dispatch(addTask({ task: res.data.data.item }));
        dispatch(setAppStatus({ status: "succeeded" }));
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
): AppThunkType => (dispatch, getState: () => AppRootStateType) => {
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

  dispatch(setAppStatus({ status: "loading" }));
  dispatch(
    changeTaskEntityStatus({ todolistId, taskId, entityStatus: "loading" })
  );
  todolistsAPI
    .updateTask(todolistId, taskId, apiModel)
    .then((res) => {
      if (res.data.resultCode === ResponseStatuses.Success) {
        dispatch(updateTask({ taskId, model: domainModel, todolistId }));
        dispatch(setAppStatus({ status: "succeeded" }));
        dispatch(
          changeTaskEntityStatus({
            todolistId,
            taskId,
            entityStatus: "succeeded",
          })
        );
      } else {
        handleServerAppError(dispatch, res.data);
        dispatch(
          changeTaskEntityStatus({ todolistId, taskId, entityStatus: "failed" })
        );
      }
    })
    .catch((err: AxiosError) => {
      handleServerNetworkError(dispatch, err.message);
    });
};
// TCs
