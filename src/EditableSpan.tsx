import React, { ChangeEvent, useState } from "react";
import { TextField } from "@material-ui/core";

type EditableSpanPropsType = {
  title: string;
  changeTitle: (changedTitle: string) => void;
};

export function EditableSpan(props: EditableSpanPropsType) {
  const [newTitle, setNewTitle] = useState<string>(props.title);
  const [editMode, setEditMode] = useState<boolean>(false);

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) =>
    setNewTitle(event.currentTarget.value);

  const onEditMode = () => setEditMode(true);
  const offEditMode = () => {
    setEditMode(false);
    props.changeTitle(newTitle);
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
  );
}
