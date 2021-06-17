import React from "react";
import { Story, Meta } from "@storybook/react";

import { EditableSpan, EditableSpanPropsType } from "./EditableSpan";
import { action } from "@storybook/addon-actions";

export default {
  title: "ToDoListApp/EditableSpan",
  component: EditableSpan,
  argTypes: {
    changeTitle: {
      // props.changeTitle
      description: "Title changed",
    },
    title: {
      // props.title
      defaultValue: "HTML",
      description: "EditableSpan starting value",
    },
  },
} as Meta;

// args === props
const Template: Story<EditableSpanPropsType> = (args) => (
  <EditableSpan {...args} />
);

export const EditableSpanExample = Template.bind({});
EditableSpanExample.args = {
  changeTitle: action("Title changed"), // action() - for callbacks
};
