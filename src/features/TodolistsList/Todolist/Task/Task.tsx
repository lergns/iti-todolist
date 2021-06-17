import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@material-ui/core";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import { Delete } from "@material-ui/icons";
import { TaskStatuses, TaskType } from "../../../../api/todolists-api";
import { RequestStatusType } from "../../../../app/app-reducer";

type TaskPropsType = {
  task: TaskType;
  todolistId: string;
  entityStatus: RequestStatusType;
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

export const Task = React.memo((props: TaskPropsType) => {
  const onClickHandler = useCallback(
    () => props.removeTask(props.task.id, props.todolistId),
    [props.task.id, props.todolistId]
  );

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      props.changeTaskStatus(
        props.task.id,
        newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,
        props.todolistId
      );
    },
    [props.task.id, props.todolistId]
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      props.changeTaskTitle(props.task.id, newValue, props.todolistId);
    },
    [props.task.id, props.todolistId]
  );

  return (
    <div
      key={props.task.id}
      className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}
    >
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={onChangeHandler}
        disabled={props.task.entityStatus === "loading"}
      />

      <EditableSpan
        value={props.task.title}
        onChange={onTitleChangeHandler}
        entityStatus={props.task.entityStatus}
      />
      <IconButton
        onClick={onClickHandler}
        disabled={props.task.entityStatus === "loading"}
      >
        <Delete />
      </IconButton>
    </div>
  );
});