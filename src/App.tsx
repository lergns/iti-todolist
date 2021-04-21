import React, { useState } from "react";
import "./App.css";
import { ToDoList } from "./ToDoList";
import { v1 } from "uuid";
import { AddItemForm } from "./AddItemForm";
import {
  AppBar,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";

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
  } // used in tasksRendered()'s return JSX (<TodoList> component)

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
    const newToDoListID = v1();
    const newToDoList: ToDoListType = {
      id: newToDoListID,
      title,
      filter: "all",
    };

    setToDoLists([...toDoLists, newToDoList]);
    setTasks({ ...tasks, [newToDoListID]: [] });
  } // used in App()'s return JSX (<App> component)

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

  // UI
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

  const toDoListComponents = toDoLists.map((toDoList) => {
    return (
      <Grid item key={toDoList.id}>
        <Paper elevation={6} style={{ padding: "20px" }}>
          <ToDoList
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
        </Paper>
      </Grid>
    );
  });

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">To-Do Lists</Typography>
          <Button variant={"outlined"} color="inherit">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: "20px 0" }}>
          <AddItemForm addItem={addToDoList} />
          {/* Inside of <App>, <AddItemForm> adds new todolist (due to the callback from <App> it receives) ! */}
        </Grid>
        <Grid container spacing={5}>
          {toDoListComponents}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
