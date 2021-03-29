import React, { useState } from "react";
import "./App.css";
import { TodoList } from "./TodoList";
import { v1 } from "uuid";

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

export type FilterValuesType = "all" | "active" | "completed";

function App() {
  // BLL:
  const [tasks, setTasks] = useState<Array<TaskType>>([
    { id: v1(), title: "HTML", isDone: true },
    { id: v1(), title: "CSS", isDone: true },
    { id: v1(), title: "React", isDone: false },
    { id: v1(), title: "Rest API", isDone: false },
    { id: v1(), title: "GraphQL", isDone: false },
  ]);

  function removeTask(taskID: string) {
    const filteredTasks = tasks.filter((task) => task.id !== taskID);
    setTasks(filteredTasks);
  }

  function addTask(title: string) {
    const newTask: TaskType = {
      id: v1(),
      title,
      isDone: false,
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
  }

  function changeTaskStatus(taskID: string, newIsDoneValue: boolean) {
    const checkedTasks = tasks.map((task) =>
      task.id === taskID ? { ...task, isDone: newIsDoneValue } : task
    ); /* if task.id (each task out of the whole mapped tasks array, its .id property) === taskID (received as function's parameter), change THIS task's .isDone value to newIsDoneValue (also received as function's parameter), for other task's - return them as they are */

    setTasks(checkedTasks); // update state with newly-checked tasks array (or, due to immutability principle, copy of original tasks array with one task's .isDone changed !)
  }

  const [toDoListFilter, setToDoListFilter] = useState<FilterValuesType>("all");

  function changeToDoListFilter(newFilterValue: FilterValuesType) {
    setToDoListFilter(newFilterValue);
  }

  function getTasksForToDoList() {
    switch (toDoListFilter) {
      case "active":
        return tasks.filter((task) => !task.isDone);

      case "completed":
        return tasks.filter((task) => task.isDone);

      default:
        return tasks;
    }
  }

  // UI:
  return (
    <div className="App">
      <TodoList
        title={"What to learn"}
        toDoListFilter={toDoListFilter}
        tasks={getTasksForToDoList()}
        removeTask={removeTask}
        addTask={addTask}
        changeToDoListFilter={changeToDoListFilter}
        changeTaskStatus={changeTaskStatus}
      />
    </div>
  );
}

export default App;
