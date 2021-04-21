import {
  addToDoListAC,
  changeToDoListFilterAC,
  changeToDoListTitleAC,
  removeToDoListAC,
  toDoListsReducer,
} from "./toDoLists-reducer";
import { v1 } from "uuid";
import { ToDoListType } from "../App";

test("correct todolist should be removed", () => {
  let todolistId1 = v1();
  let todolistId2 = v1();

  const startState: Array<ToDoListType> = [
    { id: todolistId1, title: "What to learn", filter: "all" },
    { id: todolistId2, title: "What to buy", filter: "all" },
  ];
  // tested data

  const endState = toDoListsReducer(startState, removeToDoListAC(todolistId1));
  // test execution

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
  // expected result
});

test("todolist should be added", () => {
  let todolistId1 = v1();
  let todolistId2 = v1();

  const startState: Array<ToDoListType> = [
    { id: todolistId1, title: "What to learn", filter: "all" },
    { id: todolistId2, title: "What to buy", filter: "all" },
  ];

  const endState = toDoListsReducer(startState, addToDoListAC("New ToDo List"));

  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe("New ToDo List");
});

test("todolist's title should be changed", () => {
  let todolistId1 = v1();
  let todolistId2 = v1();

  const startState: Array<ToDoListType> = [
    { id: todolistId1, title: "What to learn", filter: "all" },
    { id: todolistId2, title: "What to buy", filter: "all" },
  ];

  const endState = toDoListsReducer(
    startState,
    changeToDoListTitleAC(todolistId2, "I'm changed title")
  );

  expect(endState.length).toBe(2);
  expect(endState[1].title).toBe("I'm changed title");
});

test("todolist's filter value should be changed", () => {
  let todolistId1 = v1();
  let todolistId2 = v1();

  const startState: Array<ToDoListType> = [
    { id: todolistId1, title: "What to learn", filter: "all" },
    { id: todolistId2, title: "What to buy", filter: "all" },
  ];

  const endState = toDoListsReducer(
    startState,
    changeToDoListFilterAC(todolistId1, "active")
  );

  expect(endState.length).toBe(2);
  expect(endState[0].filter).toBe("active");
});
