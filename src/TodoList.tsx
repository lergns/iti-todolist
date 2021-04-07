import React, { ChangeEvent } from "react";
import { FilterValuesType, TaskType } from "./App";
import { AddItemForm } from "./AddItemForm";
import { EditableSpan } from "./EditableSpan";

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
      props.changeTaskTitle(props.id, task.id, changedTitle); // changedTitle received from <EditableSpan> via callback, passing forward from <TodoList> to <App> via callback

    // return of tasksRendered()
    return (
      <li key={task.id} className={task.isDone ? "is-done" : ""}>
        <input
          onChange={changeTaskStatus}
          type="checkbox"
          checked={task.isDone}
        />
        <EditableSpan title={task.title} changeTitle={changeTaskTitle} />
        {/* Inside of tasksRendered(), <EditableSpan> changes tasks' titles (due to the callback from <App> it receives) ! */}
        <button className={"btn-remove"} onClick={onRemoveTask}>
          x
        </button>
      </li>
    );
  });

  const setAllFilterValue = () => props.changeToDoListFilter(props.id, "all");
  const setActiveFilterValue = () =>
    props.changeToDoListFilter(props.id, "active");
  const setCompletedFilterValue = () =>
    props.changeToDoListFilter(props.id, "completed");

  const allButtonFilter = props.toDoListFilter === "all" ? "active-filter" : "";
  const activeButtonFilter =
    props.toDoListFilter === "active" ? "active-filter" : "";
  const completedButtonFilter =
    props.toDoListFilter === "completed" ? "active-filter" : "";

  const addTask = (title: string) => props.addTask(props.id, title); // creating new addTask() (for <AddItemForm> component), whose toDoListID parameter will be deducted automatically (taken from props.id) --> new addTask() should now only receive title as parameter !

  const removeToDoList = () => props.removeToDoList(props.id);

  const changeToDoListTitle = (changedTitle: string) =>
    props.changeToDoListTitle(props.id, changedTitle);

  // return of TodoList()
  return (
    <div>
      <h3>
        <EditableSpan title={props.title} changeTitle={changeToDoListTitle} />
        {/* Inside of <TodoList>, <EditableSpan> changes todolist's title (due to the callback from <App> it receives) ! */}
        <button onClick={removeToDoList} className={"btn-remove"}>
          X
        </button>
      </h3>
      <AddItemForm addItem={addTask} />
      {/* Inside of <TodoList>, <AddItemForm> adds new task (due to the callback from <App> it receives) ! */}
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
