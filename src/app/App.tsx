import React, { useEffect } from "react";
import "./App.css";
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "./store";
import { initializeAppTC, RequestStatusType } from "./app-reducer";
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar";
import { logoutTC } from "../features/Login/auth-reducer";
import { Login } from "../features/Login/Login";
import { Redirect, Route, Switch } from "react-router-dom";

function App() {
  useEffect(() => {
    dispatch(initializeAppTC());
  }, []);

  const dispatch = useDispatch();
  const status = useSelector<AppRootStateType, RequestStatusType>(
    (state) => state.app.status
  );
  const isInitialized = useSelector<AppRootStateType, boolean>(
    (state) => state.app.isInitialized
  );
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );

  const logoutHandler = () => dispatch(logoutTC());

  if (!isInitialized) {
    return (
      <div
        style={{
          position: "fixed",
          top: "30%",
          textAlign: "center",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">News</Typography>
            {/* only displayed when isLoggedIn === true */}
            {isLoggedIn && (
              <Button onClick={logoutHandler} color="inherit">
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
        {status === "loading" && <LinearProgress color="secondary" />}
        <Container fixed>
          <Switch>
            {/* <Switch/> - imported from react-router-dom - renders first <Route/>, for which path === true */}
            <Route exact path={"/"} render={() => <TodolistsList />} />
            <Route path={"/login"} render={() => <Login />} />
            <Route path={"/404"} render={() => <h1>404: PAGE NOT FOUND</h1>} />
            <Redirect from={"*"} to={"/404"} />
            {/* path={"*"} === ANY path ; inside of <Switch/> <Route path={"*"} /> should always be the last ! */}
          </Switch>
        </Container>
      </div>
    );
  }
}

export default App;
