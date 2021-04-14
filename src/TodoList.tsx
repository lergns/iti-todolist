import React, { ChangeEvent } from "react";
import { FilterValuesType, TaskType } from "./App";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";
import { Button, Checkbox, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

type ToDoListPropsType = {
  id: string;
  title: string;
  toDoListFilter: FilterValuesType;
  tasks: Array<TaskType>;
  removeTask: (toDoListID: string, taskID: string) => void;
  addTask: (toDoListID: string, title: string) => void;
  changeToDoListFilter: (
    toDoListID: string,
    changedFilterValue: FilterValuesType
  ) => void;
  removeToDoList: (toDoListID: string) => void;
  changeTaskStatus: (
    toDoListID: string,
    taskID: string,
    newIsDoneValue: boolean
  ) => void;
  changeTaskTitle: (
    toDoListID: string,
    taskID: string,
    changedTitle: string
  ) => void;
  changeToDoListTitle: (toDoListID: string, changedTitle: string) => void;
};

export function TodoList(props: ToDoListPropsType) {
  const tasksRendered = props.tasks.map((task) => {
    const onRemoveTask = () => props.removeTask(props.id, task.id);

    const changeTaskStatus = (event: ChangeEvent<HTMLInputElement>) =>
      props.changeTaskStatus(props.id, task.id, event.currentTarget.checked);

    const changeTaskTitle = (changedTitle: string) =>
      props.changeTaskTitle(props.id, task.id, changedTitle);

    // return of tasksRendered()
    return (
      <li key={task.id} className={task.isDone ? "is-done" : ""}>
        <Checkbox
          checked={task.isDone}
          onChange={changeTaskStatus}
          color={"primary"}
        />

        <EditableSpan title={task.title} changeTitle={changeTaskTitle} />
        <IconButton onClick={onRemoveTask}>
          <Delete />
        </IconButton>
      </li>
    );
  });

  const setAllFilterValue = () => props.changeToDoListFilter(props.id, "all");
  const setActiveFilterValue = () =>
    props.changeToDoListFilter(props.id, "active");
  const setCompletedFilterValue = () =>
    props.changeToDoListFilter(props.id, "completed");

  const addTask = (title: string) => props.addTask(props.id, title);

  const removeToDoList = () => props.removeToDoList(props.id);

  const changeToDoListTitle = (changedTitle: string) =>
    props.changeToDoListTitle(props.id, changedTitle);

  // return of TodoList()
  return (
    <div>
      <h3>
        <EditableSpan title={props.title} changeTitle={changeToDoListTitle} />

        <IconButton onClick={removeToDoList}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} />
      <ul style={{ listStyle: "none", padding: "0" }}>{tasksRendered}</ul>
      <div>
        <Button
          onClick={setAllFilterValue}
          color={"primary"}
          variant={props.toDoListFilter === "all" ? "outlined" : "contained"}
          size={"small"}
          style={{ marginRight: "5px" }}
        >
          All
        </Button>
        <Button
          onClick={setActiveFilterValue}
          color={"primary"}
          variant={props.toDoListFilter === "active" ? "outlined" : "contained"}
          size={"small"}
          style={{ marginRight: "5px" }}
        >
          Active
        </Button>
        <Button
          onClick={setCompletedFilterValue}
          color={"primary"}
          variant={
            props.toDoListFilter === "completed" ? "outlined" : "contained"
          }
          size={"small"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
}
