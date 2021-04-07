import React, { useState } from "react";
import "./App.css";
import { TodoList } from "./TodoList";
import { v1 } from "uuid";
import { AddItemForm } from "./AddItemForm";

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

export type FilterValuesType = "all" | "active" | "completed";

export type ToDoListType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  // BLL:
  const toDoListID_1 = v1();
  const toDoListID_2 = v1();

  const [toDoLists, setToDoLists] = useState<Array<ToDoListType>>([
    { id: toDoListID_1, title: "What to learn", filter: "all" },
    { id: toDoListID_2, title: "What to buy", filter: "all" },
  ]);

  const [tasks, setTasks] = useState<TasksStateType>({
    [toDoListID_1]: [
      { id: v1(), title: "HTML", isDone: true },
      { id: v1(), title: "CSS", isDone: true },
      { id: v1(), title: "React", isDone: false },
    ],
    [toDoListID_2]: [
      { id: v1(), title: "Milk", isDone: true },
      { id: v1(), title: "Bread", isDone: false },
      { id: v1(), title: "Onion", isDone: false },
    ],
  });

  function removeTask(toDoListID: string, taskID: string) {
    tasks[toDoListID] = tasks[toDoListID].filter((task) => task.id !== taskID);
    setTasks({ ...tasks });
  }

  function addTask(toDoListID: string, title: string) {
    const newTask: TaskType = {
      id: v1(),
      title,
      isDone: false,
    };

    const updatedTasks = [newTask, ...tasks[toDoListID]];
    setTasks({ ...tasks, [toDoListID]: updatedTasks });
  } // used in TodoList()'s return JSX (<TodoList> component)

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

  function changeTaskTitle(
    toDoListID: string,
    taskID: string,
    changedTitle: string
  ) {
    const changedTasks = tasks[toDoListID].map((task) =>
      task.id === taskID ? { ...task, title: changedTitle } : task
    );

    setTasks({ ...tasks, [toDoListID]: changedTasks });
  } /* used in tasksRendered()'s return JSX (<TodoList> component); 
    actually CHANGING certain todolist's certain task's title, passed from <EditableSpan> to <TodoList> to <App> via chain of callbacks ! */

  function changeToDoListFilter(
    toDoListID: string,
    changedFilterValue: FilterValuesType
  ) {
    setToDoLists(
      toDoLists.map((toDoList) =>
        toDoList.id === toDoListID
          ? { ...toDoList, filter: changedFilterValue }
          : toDoList
      )
    );
  }

  function removeToDoList(toDoListID: string) {
    setToDoLists(toDoLists.filter((toDoList) => toDoList.id !== toDoListID));
    delete tasks[toDoListID];
  }

  function addToDoList(title: string) {
    const newToDoListID = v1(); // creating new todolist's id
    const newToDoList: ToDoListType = {
      id: newToDoListID,
      title,
      filter: "all",
    }; // used in App()'s return JSX (<App> component)

    setToDoLists([...toDoLists, newToDoList]); // updating state with new todolist

    setTasks({ ...tasks, [newToDoListID]: [] }); // linking new todolist's id (key of tasks object) with empty tasks array (value of tasks object)
  }

  function changeToDoListTitle(toDoListID: string, changedTitle: string) {
    const updatedToDoLists = toDoLists.map((toDoList) =>
      toDoList.id === toDoListID
        ? {
            ...toDoList,
            title: changedTitle,
          }
        : toDoList
    );

    setToDoLists(updatedToDoLists);
  } // used in TodoList()'s return JSX (<TodoList> component)

  function getTasksForToDoList(toDoList: ToDoListType): Array<TaskType> {
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
      <AddItemForm addItem={addToDoList} />
      {/* Inside of <TodoList>, <AddItemForm> adds new task (due to the callback from <App> it receives) ! */}
      {toDoLists.map((toDoList) => {
        return (
          <TodoList
            key={toDoList.id}
            id={toDoList.id}
            title={toDoList.title}
            toDoListFilter={toDoList.filter}
            tasks={getTasksForToDoList(toDoList)}
            removeTask={removeTask}
            removeToDoList={removeToDoList}
            addTask={addTask}
            changeToDoListFilter={changeToDoListFilter}
            changeTaskStatus={changeTaskStatus}
            changeTaskTitle={changeTaskTitle}
            changeToDoListTitle={changeToDoListTitle}
          />
        );
      })}
    </div>
  );
}

export default App;
