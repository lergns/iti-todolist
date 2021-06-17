import React from "react";
import { Provider } from "react-redux";
import { RootStateType } from "./store";
import { combineReducers, createStore } from "redux";
import { tasksReducer } from "./tasks-reducer";
import { toDoListsReducer } from "./toDoLists-reducer";
import { v1 } from "uuid";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  toDoLists: toDoListsReducer,
});

const initialGlobalState = {
  toDoLists: [
    { id: "todolistId1", title: "What to learn", filter: "all" },
    { id: "todolistId2", title: "What to buy", filter: "all" },
  ],
  tasks: {
    ["todolistId1"]: [
      { id: v1(), title: "HTML&CSS", isDone: true },
      { id: v1(), title: "JS", isDone: true },
    ],
    ["todolistId2"]: [
      { id: v1(), title: "Milk", isDone: true },
      { id: v1(), title: "React Book", isDone: true },
    ],
  },
};

// creating store object for Storybook stories
export const storyBookStore = createStore(
  rootReducer,
  initialGlobalState as RootStateType
);

// decorator to provide context to stories' components
export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
