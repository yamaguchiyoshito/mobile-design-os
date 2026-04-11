import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Select } from './Select';

const options = [
  { value: 'pickup', label: '店舗受取' },
  { value: 'delivery', label: '配送' },
  { value: 'scheduled', label: '日時指定配送' },
];

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: '受取方法',
    value: '',
    options,
    placeholder: '受取方法を選択',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return (
      <div style={{ width: '100%', maxWidth: 360 }}>
        <Select {...args} value={value} onChange={setValue} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    value: 'delivery',
    description: '注文確定後の変更はできません。',
  },
};

export const Error: Story = {
  args: {
    error: '受取方法を選択してください',
  },
};

export const Disabled: Story = {
  args: {
    value: 'pickup',
    disabled: true,
  },
};
