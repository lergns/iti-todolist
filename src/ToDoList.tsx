import React, { useCallback } from "react";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";
import { Button, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { FilterValuesType } from "./state/toDoLists-reducer";
import { TaskType } from "./state/tasks-reducer";
import { Task } from "./Task";
// IMPORTS

type ToDoListPropsType = {
  toDoListID: string;
  toDoListTitle: string;
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

export const ToDoList = React.memo((props: ToDoListPropsType) => {
  const removeToDoList = () => props.removeToDoList(props.toDoListID);

  const changeToDoListTitle = useCallback(
    (changedTitle: string) =>
      props.changeToDoListTitle(props.toDoListID, changedTitle),
    [props.changeToDoListTitle, props.toDoListID]
  );

  const addTask = useCallback(
    (title: string) => props.addTask(props.toDoListID, title),
    [props.addTask, props.toDoListID]
  );

  const removeTask = useCallback(
    (taskID: string) => props.removeTask(props.toDoListID, taskID),
    [props.removeTask, props.toDoListID]
  );

  const changeTaskStatus = useCallback(
    (taskID: string, newIsDoneValue: boolean) =>
      props.changeTaskStatus(props.toDoListID, taskID, newIsDoneValue),
    [props.changeTaskStatus, props.toDoListID]
  );

  const changeTaskTitle = useCallback(
    (taskID: string, changedTitle: string) =>
      props.changeTaskTitle(props.toDoListID, taskID, changedTitle),
    [props.changeTaskTitle, props.toDoListID]
  ); // changedTitle received from <EditableSpan> via callback, passing forward from <TodoList> to <AppWithRedux> via callback

  const setAllFilterValue = useCallback(
    () => props.changeToDoListFilter(props.toDoListID, "all"),
    [props.changeToDoListFilter, props.toDoListID]
  );
  const setActiveFilterValue = useCallback(
    () => props.changeToDoListFilter(props.toDoListID, "active"),
    [props.changeToDoListFilter, props.toDoListID]
  );
  const setCompletedFilterValue = useCallback(
    () => props.changeToDoListFilter(props.toDoListID, "completed"),
    [props.changeToDoListFilter, props.toDoListID]
  );

  function getTasksForToDoList(): Array<TaskType> {
    switch (props.toDoListFilter) {
      case "active":
        return props.tasks.filter((task) => !task.isDone);
      case "completed":
        return props.tasks.filter((task) => task.isDone);
      default:
        return props.tasks;
    }
  }

  return (
    <div>
      <h3>
        <EditableSpan
          title={props.toDoListTitle}
          changeTitle={changeToDoListTitle}
        />
        {/* Inside of <TodoList>, <EditableSpan> changes todolist's title (due to the callback from <AppWithRedux> it receives) ! */}

        <IconButton onClick={removeToDoList}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} />
      {/* Inside of <TodoList>, <AddItemForm> adds new task (due to the callback from <AppWithRedux> it receives) ! */}
      <ul style={{ listStyle: "none", padding: "0" }}>
        {getTasksForToDoList().map((task) => (
          <Task
            key={task.id}
            task={task}
            removeTask={removeTask}
            changeTaskStatus={changeTaskStatus}
            changeTaskTitle={changeTaskTitle}
          />
        ))}
      </ul>
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
});
