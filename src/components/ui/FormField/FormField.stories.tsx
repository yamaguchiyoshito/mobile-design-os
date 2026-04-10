import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { FormField } from './FormField';

const meta: Meta<typeof FormField> = {
  title: 'UI/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'メールアドレス',
    value: '',
    placeholder: 'name@example.com',
    autoComplete: 'email',
    inputMode: 'email',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div style={{ width: 360 }}>
        <FormField {...args} value={value} onChangeText={setValue} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    error: '正しいメールアドレスを入力してください',
  },
};

export const Filled: Story = {
  args: {
    value: 'coffee@example.com',
    description: 'ログインと通知の送信に使用します。',
  },
};

export const Disabled: Story = {
  args: {
    value: 'locked@example.com',
    disabled: true,
  },
};
