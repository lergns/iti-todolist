import React, { useReducer } from "react";
import { ToDoList } from "../ToDoList/ToDoList";
import { v1 } from "uuid";
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
  toDoListsReducer,
  ToDoListType,
} from "../state/toDoLists-reducer";
import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
  TaskType,
} from "../state/tasks-reducer";

function AppWithReducers() {
  const toDoListID_1 = v1();
  const toDoListID_2 = v1();

  // todolists' state
  const [toDoLists, dispatchToDoLists] = useReducer(toDoListsReducer, [
    { id: toDoListID_1, title: "What to learn", filter: "all" },
    { id: toDoListID_2, title: "What to buy", filter: "all" },
  ]);

  // tasks' state
  const [tasks, dispatchTasks] = useReducer(tasksReducer, {
    [toDoListID_1]: [
      { id: v1(), title: "HTML", isDone: true },
      { id: v1(), title: "CSS", isDone: true },
      { id: v1(), title: "React", isDone: false },
    ],
    [toDoListID_2]: [
      { id: v1(), title: "Milk", isDone: true },
      { id: v1(), title: "Bread", isDone: false },
      { id: v1(), title: "Onion", isDone: false },
    ],
  });

  function removeTask(toDoListID: string, taskID: string) {
    dispatchTasks(removeTaskAC(toDoListID, taskID));
  }

  function addTask(toDoListID: string, title: string) {
    dispatchTasks(addTaskAC(toDoListID, title));
  } // used in TodoList()'s return JSX (<TodoList> component)

  function changeTaskStatus(
    toDoListID: string,
    taskID: string,
    newIsDoneValue: boolean
  ) {
    dispatchTasks(changeTaskStatusAC(toDoListID, taskID, newIsDoneValue));
  }

  function changeTaskTitle(
    toDoListID: string,
    taskID: string,
    changedTitle: string
  ) {
    dispatchTasks(changeTaskTitleAC(toDoListID, taskID, changedTitle));
  } // used in tasksRendered()'s return JSX (<TodoList> component)

  function changeToDoListFilter(
    toDoListID: string,
    changedFilterValue: FilterValuesType
  ) {
    dispatchToDoLists(changeToDoListFilterAC(toDoListID, changedFilterValue));
  }

  function removeToDoList(toDoListID: string) {
    const action = removeToDoListAC(toDoListID);
    dispatchToDoLists(action);
    dispatchTasks(action);
  }

  function addToDoList(title: string) {
    const action = addToDoListAC(title); // creating one action object to be dispatched to different reducers
    dispatchToDoLists(action);
    dispatchTasks(action); // sharing the same action object - mutual id !
  } // used in AppWithReducers()'s return JSX (<AppWithReducers> component)

  function changeToDoListTitle(toDoListID: string, changedTitle: string) {
    dispatchToDoLists(changeToDoListTitleAC(toDoListID, changedTitle));
  } // used in TodoList()'s return JSX (<TodoList> component)

  // UI
  function getTasksForToDoList(toDoList: ToDoListType): Array<TaskType> {
    switch (toDoList.filter) {
      case "active":
        return tasks[toDoList.id].filter((task) => !task.isDone);

      case "completed":
        return tasks[toDoList.id].filter((task) => task.isDone);

      default:
        return tasks[toDoList.id];
    }
  }

  const toDoListComponents = toDoLists.map((toDoList) => {
    return (
      <Grid item key={toDoList.id}>
        <Paper elevation={6} style={{ padding: "20px" }}>
          <ToDoList
            toDoListID={toDoList.id}
            toDoListTitle={toDoList.title}
            toDoListFilter={toDoList.filter}
            tasks={getTasksForToDoList(toDoList)}
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
          {/* Inside of <AppWithReducers>, <AddItemForm> adds new todolist (due to the callback from <AppWithReducers> it receives) ! */}
        </Grid>
        <Grid container spacing={5}>
          {toDoListComponents}
        </Grid>
      </Container>
    </div>
  );
}

export default AppWithReducers;
