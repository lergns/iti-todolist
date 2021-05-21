import React, { useCallback } from "react";
import { ToDoList } from "../ToDoList/ToDoList";
import { AddItemForm } from "../AddItemForm/AddItemForm";
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
} from "../state/toDoLists-reducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  TasksStateType,
} from "../state/tasks-reducer";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "../state/store";
// IMPORTS

//
export function AppWithRedux() {
  const toDoLists = useSelector<RootStateType, Array<ToDoListType>>(
    (state) => state.toDoLists
  );
  const tasks = useSelector<RootStateType, TasksStateType>(
    (state) => state.tasks
  );

  const dispatch = useDispatch();

  const removeTask = useCallback(
    (toDoListID: string, taskID: string) => {
      dispatch(removeTaskAC(toDoListID, taskID));
    },
    [dispatch]
  );

  const addTask = useCallback(
    (toDoListID: string, title: string) => {
      dispatch(addTaskAC(toDoListID, title));
    },
    [dispatch]
  ); // used in TodoList()'s return JSX (<TodoList> component)

  const changeTaskStatus = useCallback(
    (toDoListID: string, taskID: string, newIsDoneValue: boolean) => {
      dispatch(changeTaskStatusAC(toDoListID, taskID, newIsDoneValue));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (toDoListID: string, taskID: string, changedTitle: string) => {
      dispatch(changeTaskTitleAC(toDoListID, taskID, changedTitle));
    },
    [dispatch]
  ); // used in Task()'s return JSX (<Task> component)

  const changeToDoListFilter = useCallback(
    (toDoListID: string, changedFilterValue: FilterValuesType) => {
      dispatch(changeToDoListFilterAC(toDoListID, changedFilterValue));
    },
    [dispatch]
  );

  const removeToDoList = useCallback(
    (toDoListID: string) => {
      dispatch(removeToDoListAC(toDoListID));
    },
    [dispatch]
  );

  const addToDoList = useCallback(
    (title: string) => {
      dispatch(addToDoListAC(title));
    },
    [dispatch]
  ); // used in AppWithRedux()'s return JSX (<AppWithRedux> component)

  const changeToDoListTitle = useCallback(
    (toDoListID: string, changedTitle: string) => {
      dispatch(changeToDoListTitleAC(toDoListID, changedTitle));
    },
    [dispatch]
  ); // used in TodoList()'s return JSX (<TodoList> component)

  // UI
  const toDoListComponents = toDoLists.map((toDoList) => {
    return (
      <Grid item key={toDoList.id}>
        <Paper elevation={6} style={{ padding: "20px" }}>
          <ToDoList
            toDoListID={toDoList.id}
            toDoListTitle={toDoList.title}
            toDoListFilter={toDoList.filter}
            tasks={tasks[toDoList.id]}
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
          {/* Inside of <AppWithRedux>, <AddItemForm> adds new todolist (due to the callback from <AppWithRedux> it receives) ! */}
        </Grid>
        <Grid container spacing={5}>
          {toDoListComponents}
        </Grid>
      </Container>
    </div>
  );
}

export default AppWithRedux;
