import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import { Delete } from "@material-ui/icons";
import { TaskStatuses, TaskType } from "../../../../api/todolists-api";

type TaskPropsType = {
  task: TaskType;
  todolistId: string;
  changeTaskStatus: (
    id: string,
    status: TaskStatuses,
    todolistId: string
  ) => void;
  changeTaskTitle: (
    taskId: string,
    newTitle: string,
    todolistId: string
  ) => void;
  removeTask: (taskId: string, todolistId: string) => void;
};

export const Task = React.memo(
  ({
    task,
    changeTaskStatus,
    changeTaskTitle,
    removeTask,
    todolistId,
  }: TaskPropsType) => {
    const onClickHandler = useCallback(() => removeTask(task.id, todolistId), [
      task.id,
      todolistId,
      removeTask,
    ]);

    const onChangeHandler = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        changeTaskStatus(
          task.id,
          newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.Active,
          todolistId
        );
      },
      [task.id, todolistId, changeTaskStatus]
    );

    const onTitleChangeHandler = useCallback(
      (newValue: string) => {
        changeTaskTitle(task.id, newValue, todolistId);
      },
      [task.id, todolistId, changeTaskTitle]
    );

    return (
      <div
        key={task.id}
        className={task.status === TaskStatuses.Completed ? "is-done" : ""}
      >
        <Checkbox
          checked={task.status === TaskStatuses.Completed}
          color="primary"
          onChange={onChangeHandler}
          disabled={task.entityStatus === "loading"}
        />

        <EditableSpan
          value={task.title}
          onChange={onTitleChangeHandler}
          entityStatus={task.entityStatus}
        />
        <IconButton
          onClick={onClickHandler}
          disabled={task.entityStatus === "loading"}
        >
          <Delete />
        </IconButton>
      </div>
    );
  }
);
