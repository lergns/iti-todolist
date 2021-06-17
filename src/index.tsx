import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import AppWithRedux from "./App/AppWithRedux";
import { store } from "./state/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    {/* app which uses Redux has to ALWAYS be wrapped up with <Provider> (from react-redux) in order to create Context for all its child components --> store ( state and dispatch() ) can be accessed directly from any component ! */}
    <AppWithRedux />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
