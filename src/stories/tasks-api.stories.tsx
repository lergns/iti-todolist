import React, { useEffect, useState } from "react";
import { tasksAPI, UpdatedTaskType } from "../api/tasks-api";

export default {
  title: "API",
};

export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "8efad9d7-75b8-4518-b28e-80e458322f46";
    tasksAPI.getTasks(todolistId).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};

export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "8efad9d7-75b8-4518-b28e-80e458322f46";
    tasksAPI.createTask(todolistId, "BOMB!").then((res) => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "8efad9d7-75b8-4518-b28e-80e458322f46";
    const taskId = "cd725235-64a4-4c46-b573-4db4b06abe0d";
    tasksAPI.deleteTask(todolistId, taskId).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = "8efad9d7-75b8-4518-b28e-80e458322f46";
    const taskId = "64730781-0a4f-4a23-81b5-73ae0de16861";
    const updatedTask: UpdatedTaskType = {
      description: "Description",
      title: "Title",
      status: 2,
      priority: 1,
      startDate: "27 May",
      deadline: "1 June",
    };
    tasksAPI.updateTask(todolistId, taskId, updatedTask).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
