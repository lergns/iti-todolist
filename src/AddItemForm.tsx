import React, { ChangeEvent, KeyboardEvent, useState } from "react";

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

  const errorText = error ? <div className={"error-text"}>{error}</div> : null;

  return (
    <div>
      <input
        value={newTitle}
        onChange={changeTitle}
        onKeyPress={onKeyPressAddItem}
        className={error ? "error" : ""}
      />
      <button onClick={addItem}>+</button>
      {errorText}
    </div>
  );
}
