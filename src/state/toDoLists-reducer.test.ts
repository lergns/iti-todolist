import {
  addToDoListAC,
  changeToDoListFilterAC,
  changeToDoListTitleAC,
  removeToDoListAC,
  toDoListsReducer,
  ToDoListType,
} from "./toDoLists-reducer";
import { v1 } from "uuid";

let todolistId1: string;
let todolistId2: string;
let startState: Array<ToDoListType>;

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = [
    { id: todolistId1, title: "What to learn", filter: "all" },
    { id: todolistId2, title: "What to buy", filter: "all" },
  ];
});

test("correct todolist should be removed", () => {
  const endState = toDoListsReducer(startState, removeToDoListAC(todolistId1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("todolist should be added", () => {
  const endState = toDoListsReducer(startState, addToDoListAC("New ToDo List"));

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe("New ToDo List");
});

test("todolist's title should be changed", () => {
  const endState = toDoListsReducer(
    startState,
    changeToDoListTitleAC(todolistId2, "I'm changed title")
  );

  expect(endState.length).toBe(2);
  expect(endState[1].title).toBe("I'm changed title");
});

test("todolist's filter value should be changed", () => {
  const endState = toDoListsReducer(
    startState,
    changeToDoListFilterAC(todolistId1, "active")
  );

  expect(endState.length).toBe(2);
  expect(endState[0].filter).toBe("active");
});
