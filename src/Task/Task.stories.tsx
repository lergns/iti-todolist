import React from "react";
import { Story, Meta } from "@storybook/react";

import { Task, TaskPropsType } from "./Task";
import { action } from "@storybook/addon-actions";

export default {
  title: "ToDoListApp/Task",
  component: Task,
} as Meta;

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

const actionArgs = {
  changeTaskStatus: action("Task status changed"),
  changeTaskTitle: action("Task title changed"),
  removeTask: action("Task removed"),
};

export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {
  ...actionArgs,
  task: { id: "1", title: "JS", isDone: true },
};

export const TaskIsUndoneExample = Template.bind({});
TaskIsUndoneExample.args = {
  ...actionArgs,
  task: { id: "1", title: "JS", isDone: false },
};
