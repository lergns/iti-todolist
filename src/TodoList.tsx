import React, { KeyboardEvent, ChangeEvent, useState } from "react";
import { FilterValuesType, TaskType } from "./App";

type TodoListPropsType = {
  title: string;
  toDoListFilter: FilterValuesType;
  tasks: Array<TaskType>;
  removeTask: (taskID: string) => void;
  addTask: (title: string) => void;
  changeToDoListFilter: (newFilterValue: FilterValuesType) => void;
  changeTaskStatus: (taskID: string, newIsDoneValue: boolean) => void;
};

export function TodoList(props: TodoListPropsType) {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const tasksRendered = props.tasks.map((task) => {
    const onRemoveTask = () => props.removeTask(task.id); // declaring onRemoveTask() and changeStatus() inside of the .map() method, so that these functions are available for all tasks !

    const changeTaskStatus = (event: ChangeEvent<HTMLInputElement>) =>
      props.changeTaskStatus(task.id, event.currentTarget.checked); // task.id - each task from the mapped tasks array (tasksRendered() parent function !); newIsDoneValue is taken from event.currentTarget.checked

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
  }); // adding className "is-done" if task.isDone === true

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(event.currentTarget.value);
    setError(null); // when changing the input - error === null
  };

  const onKeyPressAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") addTask();
  };

  const addTask = () => {
    const trimmedNewTaskTitle = newTaskTitle.trim(); // .trim() trims free spaces from both before and after string
    if (trimmedNewTaskTitle) props.addTask(trimmedNewTaskTitle);
    // truthy/falsy value - prohibits adding "" as new task
    else setError("Title is required"); // if trimmedNewTaskTitle === false (falsy value), error === "Title is required"

    setNewTaskTitle(""); // clearing the input field
  };

  const setAllFilterValue = () => props.changeToDoListFilter("all");
  const setActiveFilterValue = () => props.changeToDoListFilter("active");
  const setCompletedFilterValue = () => props.changeToDoListFilter("completed");

  const allButtonFilter = props.toDoListFilter === "all" ? "active-filter" : "";
  const activeButtonFilter =
    props.toDoListFilter === "active" ? "active-filter" : "";
  const completedButtonFilter =
    props.toDoListFilter === "completed" ? "active-filter" : ""; // assigning class depending on the ternary operator

  const errorText = error ? <div className={"error-text"}>{error}</div> : null; // if error === true (if setError has set error to "Title is required" --> truthy value !), render it inside of a <div>

  // return of TodoList()
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input
          value={newTaskTitle}
          onChange={changeTitle}
          onKeyPress={onKeyPressAddTask}
          className={error ? "error" : ""}
        />
        <button onClick={addTask}>+</button>
        {errorText} {/* conditional rendering of errorText */}
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
