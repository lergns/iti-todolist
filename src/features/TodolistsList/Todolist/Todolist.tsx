import React, { useCallback } from "react";
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm";
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan";
import { Button, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Task } from "./Task/Task";
import { TaskStatuses, TaskType } from "../../../api/todolists-api";
import { FilterValuesType } from "../todolists-reducer";
import { RequestStatusType } from "../../../app/app-reducer";

type TodolistPropsType = {
  id: string;
  title: string;
  tasks: Array<TaskType>;
  entityStatus: RequestStatusType;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  changeTaskStatus: (
    id: string,
    status: TaskStatuses,
    todolistId: string
  ) => void;
  changeTaskTitle: (
    taskId: string,
    newTitle: string,
    todolistId: string
  ) => void;
  removeTask: (taskId: string, todolistId: string) => void;
  removeTodolist: (id: string) => void;
  changeTodolistTitle: (id: string, newTitle: string) => void;
  filter: FilterValuesType;
};

export const Todolist = React.memo(function ({
  id,
  filter,
  removeTask,
  changeTaskStatus,
  entityStatus,
  changeTaskTitle,
  changeFilter,
  title,
  tasks,
  changeTodolistTitle,
  removeTodolist,
  addTask,
}: TodolistPropsType) {
  const onTodolistRemove = () => {
    removeTodolist(id);
  };

  const onTaskAdd = useCallback(
    (title: string) => {
      addTask(title, id);
    },
    [addTask, id]
  );

  const onTodolistTitleChange = useCallback(
    (title: string) => {
      changeTodolistTitle(id, title);
    },
    [id, changeTodolistTitle]
  );

  const onAllClickHandler = useCallback(() => changeFilter("all", id), [
    id,
    changeFilter,
  ]);

  const onActiveClickHandler = useCallback(() => changeFilter("active", id), [
    id,
    changeFilter,
  ]);

  const onCompletedClickHandler = useCallback(
    () => changeFilter("completed", id),
    [id, changeFilter]
  );

  let tasksOfTodolist = tasks;

  if (filter === "active") {
    tasksOfTodolist = tasks.filter(
      (task) => task.status === TaskStatuses.Active
    );
  }
  if (filter === "completed") {
    tasksOfTodolist = tasks.filter(
      (task) => task.status === TaskStatuses.Completed
    );
  }

  return (
    <div>
      <h3>
        <EditableSpan
          value={title}
          onChange={onTodolistTitleChange}
          entityStatus={entityStatus}
        />
        <IconButton
          onClick={onTodolistRemove}
          disabled={entityStatus === "loading"}
        >
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={onTaskAdd} entityStatus={entityStatus} />
      <div>
        {tasksOfTodolist.map((task) => (
          <Task
            key={task.id}
            task={task}
            todolistId={id}
            removeTask={removeTask}
            changeTaskTitle={changeTaskTitle}
            changeTaskStatus={changeTaskStatus}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button
          variant={filter === "all" ? "outlined" : "text"}
          onClick={onAllClickHandler}
          color={"default"}
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
