import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'UI/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'メールアドレス',
    value: '',
    placeholder: 'name@example.com',
    autoComplete: 'email',
    inputMode: 'email',
    enterKeyHint: 'next',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div style={{ width: '100%', maxWidth: 360 }}>
        <TextInput {...args} value={value} onChangeText={setValue} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof TextInput>;

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
