import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "../../app/store";
import {
  addTodolistTC,
  changeTodolistFilter,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
} from "./todolists-reducer";
import {
  addTaskTC,
  removeTaskTC,
  TasksStateType,
  updateTaskTC,
} from "./tasks-reducer";
import { TaskStatuses } from "../../api/todolists-api";
import { Grid, Paper } from "@material-ui/core";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Redirect } from "react-router-dom";

export const TodolistsList: React.FC = () => {
  const dispatch = useDispatch();

  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todolists
  );
  const tasks = useSelector<AppRootStateType, TasksStateType>(
    (state) => state.tasks
  );
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(fetchTodolistsTC());
  }, [dispatch, isLoggedIn]);

  const removeTask = useCallback(
    function (id: string, todolistId: string) {
      dispatch(removeTaskTC(id, todolistId));
    },
    [dispatch]
  );

  const addTask = useCallback(
    function (title: string, todolistId: string) {
      dispatch(addTaskTC(title, todolistId));
    },
    [dispatch]
  );

  const changeStatus = useCallback(
    function (id: string, status: TaskStatuses, todolistId: string) {
      dispatch(updateTaskTC(id, { status }, todolistId));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    function (id: string, newTitle: string, todolistId: string) {
      dispatch(updateTaskTC(id, { title: newTitle }, todolistId));
    },
    [dispatch]
  );

  const changeFilter = useCallback(
    function (filter: FilterValuesType, id: string) {
      dispatch(changeTodolistFilter({ id, filter }));
    },
    [dispatch]
  );

  const removeTodolist = useCallback(
    function (id: string) {
      dispatch(removeTodolistTC(id));
    },
    [dispatch]
  );

  const changeTodolistTitle = useCallback(
    function (id: string, title: string) {
      dispatch(changeTodolistTitleTC(id, title));
    },
    [dispatch]
  );

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Redirect to={"/login"} />;
  } else {
    return (
      <>
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
                    entityStatus={tl.entityStatus}
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
      </>
    );
  }
};
