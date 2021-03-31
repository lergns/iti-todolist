import React, { KeyboardEvent, ChangeEvent, useState } from "react";
import { FilterValuesType, TaskType } from "./App";

type ToDoListPropsType = {
  id: string;
  title: string;
  toDoListFilter: FilterValuesType;
  tasks: Array<TaskType>;
  removeTask: (toDoListID: string, taskID: string) => void;
  addTask: (toDoListID: string, title: string) => void;
  changeToDoListFilter: (
    toDoListID: string,
    newFilterValue: FilterValuesType
  ) => void;
  removeToDoList: (toDoListID: string) => void;
  changeTaskStatus: (
    toDoListID: string,
    taskID: string,
    newIsDoneValue: boolean
  ) => void; // adding toDoListID: string to props' callbacks
};

export function TodoList(props: ToDoListPropsType) {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // managing local state of each todolist

  const tasksRendered = props.tasks.map((task) => {
    const onRemoveTask = () => props.removeTask(props.id, task.id); // order of parameters depends on props type (ToDoListPropsType) !

    const changeTaskStatus = (event: ChangeEvent<HTMLInputElement>) =>
      props.changeTaskStatus(props.id, task.id, event.currentTarget.checked);

    // return of tasksRendered()
    return (
      <li key={task.id} className={task.isDone ? "is-done" : ""}>
        <input
          onChange={changeTaskStatus}
          type="checkbox"
          checked={task.isDone}
        />
        <span>{task.title}</span>
        <button className={"btn-remove"} onClick={onRemoveTask}>
          x
        </button>
      </li>
    );
  });

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(event.currentTarget.value);
    setError(null);
  };

  const onKeyPressAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") addTask();
  };

  const addTask = () => {
    const trimmedNewTaskTitle = newTaskTitle.trim();
    if (trimmedNewTaskTitle) props.addTask(props.id, trimmedNewTaskTitle);
    else setError("Title is required");

    setNewTaskTitle("");
  };

  const setAllFilterValue = () => props.changeToDoListFilter(props.id, "all");
  const setActiveFilterValue = () =>
    props.changeToDoListFilter(props.id, "active");
  const setCompletedFilterValue = () =>
    props.changeToDoListFilter(props.id, "completed"); // passing toDoListID and newFilterValue from UI (callback on click on certain todolist) to BLL's setToDoLists() !

  const allButtonFilter = props.toDoListFilter === "all" ? "active-filter" : "";
  const activeButtonFilter =
    props.toDoListFilter === "active" ? "active-filter" : "";
  const completedButtonFilter =
    props.toDoListFilter === "completed" ? "active-filter" : "";

  const errorText = error ? <div className={"error-text"}>{error}</div> : null;

  const removeToDoList = () => props.removeToDoList(props.id);

  // return of TodoList()
  return (
    <div>
      <h3>
        {props.title}
        <button onClick={removeToDoList} className={"btn-remove"}>
          X
        </button>
      </h3>
      <div>
        <input
          value={newTaskTitle}
          onChange={changeTitle}
          onKeyPress={onKeyPressAddTask}
          className={error ? "error" : ""}
        />
        <button onClick={addTask}>+</button>
        {errorText}
      </div>
      <ul>{tasksRendered}</ul>

      <div>
        <button className={allButtonFilter} onClick={setAllFilterValue}>
          All
        </button>
        <button className={activeButtonFilter} onClick={setActiveFilterValue}>
          Active
        </button>
        <button
          className={completedButtonFilter}
          onClick={setCompletedFilterValue}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
