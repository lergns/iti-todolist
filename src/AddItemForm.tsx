import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { AddBox } from "@material-ui/icons";

type AddItemFormPropsType = {
  addItem: (title: string) => void; // either addToDoList() - if passed from App(), or addTask() - if passed from TodoList()
};

export function AddItemForm(props: AddItemFormPropsType) {
  const [newTitle, setNewTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.currentTarget.value);
    setError(null);
  };

  const addItem = () => {
    const trimmedNewTitle = newTitle.trim();
    if (trimmedNewTitle) props.addItem(trimmedNewTitle);
    else setError("Title is required");

    setNewTitle("");
  };

  const onKeyPressAddItem = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") addItem();
  };

  return (
    <div>
      <TextField
        value={newTitle}
        onChange={changeTitle}
        onKeyPress={onKeyPressAddItem}
        variant={"outlined"}
        label={"Title"}
        error={!!error}
        helperText={error}
      />

      <IconButton onClick={addItem} color={"primary"}>
        <AddBox />
      </IconButton>
    </div>
  );
}
