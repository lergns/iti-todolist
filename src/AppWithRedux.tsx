import React from "react";
import { ToDoList } from "./ToDoList";
import { AddItemForm } from "./AddItemForm";
import "./App.css";
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
import {
  addToDoListAC,
  changeToDoListFilterAC,
  changeToDoListTitleAC,
  FilterValuesType,
  removeToDoListAC,
  ToDoListType,
} from "./state/toDoLists-reducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  TasksStateType,
  TaskType,
} from "./state/tasks-reducer";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "./state/store";

function AppWithRedux() {
  // MSTP analogue
  const toDoLists = useSelector<RootStateType, Array<ToDoListType>>(
    (state) => state.toDoLists
  );
  const tasks = useSelector<RootStateType, TasksStateType>(
    (state) => state.tasks
  ); // useSelector() hook is connected to Redux's store.getState() behind the scenes --> has direct access to root state !

  // MDTP analogue
  const dispatch = useDispatch(); // useDispatch() hook dispatches to rootReducer() of Redux --> dispatching action into all reducers at once !

  function removeTask(toDoListID: string, taskID: string) {
    dispatch(removeTaskAC(toDoListID, taskID));
  }

  function addTask(toDoListID: string, title: string) {
    dispatch(addTaskAC(toDoListID, title));
  } // used in TodoList()'s return JSX (<TodoList> component)

  function changeTaskStatus(
    toDoListID: string,
    taskID: string,
    newIsDoneValue: boolean
  ) {
    dispatch(changeTaskStatusAC(toDoListID, taskID, newIsDoneValue));
  }

  function changeTaskTitle(
    toDoListID: string,
    taskID: string,
    changedTitle: string
  ) {
    dispatch(changeTaskTitleAC(toDoListID, taskID, changedTitle));
  } // used in tasksRendered()'s return JSX (<TodoList> component)

  function changeToDoListFilter(
    toDoListID: string,
    changedFilterValue: FilterValuesType
  ) {
    dispatch(changeToDoListFilterAC(toDoListID, changedFilterValue));
  }

  function removeToDoList(toDoListID: string) {
    dispatch(removeToDoListAC(toDoListID));
  }

  function addToDoList(title: string) {
    dispatch(addToDoListAC(title));
  } // used in AppWithReducers()'s return JSX (<AppWithReducers> component)

  function changeToDoListTitle(toDoListID: string, changedTitle: string) {
    dispatch(changeToDoListTitleAC(toDoListID, changedTitle));
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
          {/* Inside of <AppWithReducers>, <AddItemForm> adds new todolist (due to the callback from <AppWithReducers> it receives) ! */}
        </Grid>
        <Grid container spacing={5}>
          {toDoListComponents}
        </Grid>
      </Container>
    </div>
  );
}

export default AppWithRedux;
