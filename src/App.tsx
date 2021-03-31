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

export type ToDoListStateType = {
  id: string;
  title: string;
  filter: FilterValuesType;
}; // type of todolist

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  // BLL:
  const toDoListID_1 = v1();
  const toDoListID_2 = v1(); // todolists' ids are stored in variables

  const [toDoLists, setToDoLists] = useState<Array<ToDoListStateType>>([
    { id: toDoListID_1, title: "What to learn", filter: "all" },
    { id: toDoListID_2, title: "What to buy", filter: "all" },
  ]); // todolists' state

  const [tasks, setTasks] = useState<TasksStateType>({
    [toDoListID_1]: [
      // [toDoListID_1] has to be in [] so that JS understands it is not newly-created property with local scope, but reference to a variable from scope chain !
      { id: v1(), title: "HTML", isDone: true },
      { id: v1(), title: "CSS", isDone: true },
      { id: v1(), title: "React", isDone: false },
    ],
    [toDoListID_2]: [
      { id: v1(), title: "Milk", isDone: true },
      { id: v1(), title: "Bread", isDone: false },
      { id: v1(), title: "Onion", isDone: false },
    ],
  }); // tasks' state; associative array; todolists and tasks are linked via unique ids stored in variables

  function removeTask(toDoListID: string, taskID: string) {
    tasks[toDoListID] = tasks[toDoListID].filter((task) => task.id !== taskID); // filtering out task to be removed by certain taskID
    setTasks({ ...tasks }); // passing new object with COPY of tasks object without removed task - object immutability principle of the functional programming !
  }

  function addTask(toDoListID: string, title: string) {
    const newTask: TaskType = {
      id: v1(),
      title,
      isDone: false,
    }; // creating new task with received title

    const updatedTasks = [newTask, ...tasks[toDoListID]]; // creating new array with copy of tasks of a certain todolist + its newTask
    setTasks({ ...tasks, [toDoListID]: updatedTasks }); // setting copy of tasks with updatedTasks (of a certain todolist, defined by toDoListID received from UI via callback) array, which contains new task
  }

  function changeTaskStatus(
    toDoListID: string,
    taskID: string,
    newIsDoneValue: boolean
  ) {
    const checkedTasks = tasks[toDoListID].map((task) =>
      task.id === taskID ? { ...task, isDone: newIsDoneValue } : task
    );

    setTasks({ ...tasks, [toDoListID]: checkedTasks });
  }

  function changeToDoListFilter(
    toDoListID: string,
    newFilterValue: FilterValuesType
  ) {
    setToDoLists(
      toDoLists.map((toDoList) =>
        toDoList.id === toDoListID
          ? { ...toDoList, filter: newFilterValue }
          : toDoList
      )
    );
  }

  function removeToDoList(toDoListID: string) {
    setToDoLists(toDoLists.filter((toDoList) => toDoList.id !== toDoListID));
    delete tasks[toDoListID]; // deleting tasks of deleted todolist as well as todolist itself
  }

  function getTasksForToDoList(toDoList: ToDoListStateType): Array<TaskType> {
    switch (toDoList.filter) {
      case "active":
        return tasks[toDoList.id].filter((task) => !task.isDone);

      case "completed":
        return tasks[toDoList.id].filter((task) => task.isDone);

      default:
        return tasks[toDoList.id];
    }
  }

  // UI:
  return (
    <div className="App">
      {toDoLists.map((toDoList) => {
        {
          /* mapping through the whole todolists state array and for each todolist returning JSX */
        }
        return (
          <TodoList
            key={
              toDoList.id
            } /* key - reserved React keyword; it has to be set since we're inside of .map() method ! */
            id={toDoList.id}
            title={toDoList.title}
            toDoListFilter={toDoList.filter}
            tasks={getTasksForToDoList(toDoList)}
            removeTask={removeTask}
            removeToDoList={removeToDoList}
            addTask={addTask}
            changeToDoListFilter={changeToDoListFilter}
            changeTaskStatus={changeTaskStatus}
          />
        );
      })}
    </div>
  );
}

export default App;
