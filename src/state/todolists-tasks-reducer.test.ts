import {
  addToDoListAC,
  toDoListsReducer,
  ToDoListType,
} from "./toDoLists-reducer";
import { tasksReducer, TasksStateType } from "./tasks-reducer";

test("ids should be equal", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<ToDoListType> = [];

  const action = addToDoListAC("new todolist");

  const endTasksState = tasksReducer(startTasksState, action); // { "ewiof-whef": [] }
  const endTodolistsState = toDoListsReducer(startTodolistsState, action); // [ {id: "ewiof-whef", title: "new todolist", filter: "all"} ]

  const keys = Object.keys(endTasksState); // [ "ewiof-whef" ]
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.toDoListID);
  expect(idFromTodolists).toBe(action.toDoListID);
});
