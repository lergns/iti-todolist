import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { IconButton, TextField } from "@material-ui/core";
import { AddBox } from "@material-ui/icons";

type AddItemFormPropsType = {
  addItem: (title: string) => void; // either addToDoList() - if passed from AppWithRedux(), or addTask() - if passed from TodoList()
};

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
  const [newTitle, setNewTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    error && setError(null);
    setNewTitle(event.currentTarget.value);
  };

  const addItem = () => {
    const trimmedNewTitle = newTitle.trim();
    if (trimmedNewTitle) {
      props.addItem(trimmedNewTitle);
    } else setError("Title is required");

    setNewTitle("");
  };

  const onKeyPressAddItem = (event: KeyboardEvent<HTMLInputElement>) => {
    error && setError(null);
    if (event.key === "Enter") {
      addItem();
    }
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
});
