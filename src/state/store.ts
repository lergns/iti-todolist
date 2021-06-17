import { tasksReducer } from "./tasks-reducer";
import { toDoListsReducer } from "./toDoLists-reducer";
import { combineReducers, createStore } from "redux";

export type RootStateType = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  tasks: tasksReducer,
  toDoLists: toDoListsReducer,
});

export const store = createStore(rootReducer);

// @ts-ignore
window.store = store;
