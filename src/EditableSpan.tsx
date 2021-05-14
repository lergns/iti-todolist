import React, { ChangeEvent, useState } from "react";
import { TextField } from "@material-ui/core";

type EditableSpanPropsType = {
  title: string; // either task.title - if passed from Task(), or toDoList.title - if passed from TodoList()
  changeTitle: (changedTitle: string) => void; // either changeTaskTitle() - if passed from Task(), or changeToDoListTitle() - if passed from TodoList()
};

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
  const [newTitle, setNewTitle] = useState<string>(props.title); // either task.title - if passed from Task(), or toDoList.title - if passed from TodoList()
  const [editMode, setEditMode] = useState<boolean>(false);

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) =>
    setNewTitle(event.currentTarget.value);

  const onEditMode = () => setEditMode(true);
  const offEditMode = () => {
    setEditMode(false);
    props.changeTitle(newTitle); // passing from <EditableSpan> to <TodoList> via callback
  };

  return editMode ? (
    <TextField
      value={newTitle}
      onChange={changeTitle}
      onBlur={offEditMode}
      autoFocus
      color={"primary"}
      variant={"standard"}
    />
  ) : (
    <span onDoubleClick={onEditMode}>{props.title}</span>
  ); // for <span> - value is received from parent component via props (even after it was changed via <input> !), for <input> - it is received from component's local state
});
