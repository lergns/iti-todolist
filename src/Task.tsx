import React, { ChangeEvent } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "./EditableSpan";
import { Delete } from "@material-ui/icons";
import { TaskType } from "./state/tasks-reducer";
// IMPORTS

type TaskPropsType = {
  task: TaskType;
  changeTaskStatus: (taskID: string, newIsDoneValue: boolean) => void;
  changeTaskTitle: (taskID: string, changedTitle: string) => void;
  removeTask: (taskID: string) => void;
};

export const Task = React.memo(
  // props destructured
  ({ task, changeTaskStatus, changeTaskTitle, removeTask }: TaskPropsType) => {
    const onRemoveClickHandler = () => removeTask(task.id);

    const onStatusChangeHandler = (event: ChangeEvent<HTMLInputElement>) =>
      changeTaskStatus(task.id, event.currentTarget.checked);

    const onTitleChangeHandler = (changedTitle: string) =>
      changeTaskTitle(task.id, changedTitle);

    return (
      <li key={task.id} className={task.isDone ? "is-done" : ""}>
        <Checkbox
          checked={task.isDone}
          onChange={onStatusChangeHandler}
          color={"primary"}
        />

        <EditableSpan title={task.title} changeTitle={onTitleChangeHandler} />
        {/* Inside of Task(), <EditableSpan> changes task's title (due to the callback from <AppWithRedux> it receives) ! */}
        <IconButton onClick={onRemoveClickHandler}>
          <Delete />
        </IconButton>
      </li>
    );
  }
);
