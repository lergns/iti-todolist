import React, { ChangeEvent, useState } from "react";

type EditableSpanPropsType = {
  title: string; // either task.title - if passed from tasksRendered(), or toDoList.title - if passed from TodoList()
  changeTitle: (changedTitle: string) => void; // either changeTaskTitle() - if passed from tasksRendered(), or changeToDoListTitle() - if passed from TodoList()
};

export function EditableSpan(props: EditableSpanPropsType) {
  const [newTitle, setNewTitle] = useState<string>(props.title); // starting value of local state's newTitle (value of <input> ) is props.title (either task.title or toDoList.title)
  const [editMode, setEditMode] = useState<boolean>(false);

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) =>
    setNewTitle(event.currentTarget.value);

  const onEditMode = () => setEditMode(true);
  const offEditMode = () => {
    setEditMode(false);
    props.changeTitle(newTitle); // passing from <EditableSpan> to <TodoList> via callback
  }; // updating title on offEditMode() - when <input> loses the focus

  // if editMode === true ? ... : ...
  return editMode ? (
    <input
      value={newTitle}
      onChange={changeTitle}
      onBlur={offEditMode}
      autoFocus
    /> // === autoFocus={true} - sets cursor at the end of <input> field
  ) : (
    <span onDoubleClick={onEditMode}>{props.title}</span>
  ); // conditional rendering; for <span> - value is received from parent component vid props (even after it was changed via <input> !), for <input> - it is received from component's local state !
}
