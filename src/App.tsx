import React, { useCallback, useEffect } from "react";
import "./App.css";
import { Todolist } from "./Todolist";
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
import {
  addTodolistTC,
  changeTodolistFilterAC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
  updateTodolistTitleTC,
} from "./state/todolists-reducer";
import {
  addTaskTC,
  removeTaskTC,
  updateTaskStatusTC,
  updateTaskTitleTC,
} from "./state/tasks-reducer";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "./state/store";
import { TaskStatuses, TaskType, todolistsAPI } from "./api/todolists-api";

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  useEffect(() => {
    todolistsAPI.getTodolists().then((res) => {
      dispatch(fetchTodolistsTC());
    });
  }, []);

  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todolists
  );
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    (state) => state.tasks
  );
  const dispatch = useDispatch();

  const removeTask = useCallback((id: string, todolistId: string) => {
    dispatch(removeTaskTC(id, todolistId));
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(addTaskTC(todolistId, title));
  }, []);

  const changeStatus = useCallback(function (
    id: string,
    status: TaskStatuses,
    todolistId: string
  ) {
    dispatch(updateTaskStatusTC(id, todolistId, status));
  },
  []);

  const changeTaskTitle = useCallback(function (
    id: string,
    newTitle: string,
    todolistId: string
  ) {
    dispatch(updateTaskTitleTC(id, todolistId, newTitle));
  },
  []);

  const changeFilter = useCallback(function (
    value: FilterValuesType,
    todolistId: string
  ) {
    dispatch(changeTodolistFilterAC(todolistId, value));
  },
  []);

  const removeTodolist = useCallback(function (id: string) {
    dispatch(removeTodolistTC(id));
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(updateTodolistTitleTC(id, title));
  }, []);

  const addTodolist = useCallback((title: string) => {
    dispatch(addTodolistTC(title));
  }, []);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: "20px" }}>
          <AddItemForm addItem={addTodolist} />
        </Grid>
        <Grid container spacing={3}>
          {todolists.map((tl) => {
            let allTodolistTasks = tasks[tl.id];

            return (
              <Grid item key={tl.id}>
                <Paper style={{ padding: "10px" }}>
                  <Todolist
                    id={tl.id}
                    title={tl.title}
                    tasks={allTodolistTasks}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    filter={tl.filter}
                    removeTodolist={removeTodolist}
                    changeTaskTitle={changeTaskTitle}
                    changeTodolistTitle={changeTodolistTitle}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
