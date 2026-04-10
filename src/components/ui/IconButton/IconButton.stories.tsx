import type { Meta, StoryObj } from '@storybook/react-vite';

import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'UI/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    icon: 'close',
    label: '閉じる',
    variant: 'ghost',
    size: 'md',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['ghost', 'secondary', 'primary', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    onPress: {
      action: 'pressed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    icon: 'shopping-cart',
    label: '追加',
    variant: 'primary',
  },
};

export const Destructive: Story = {
  args: {
    icon: 'trash',
    label: '削除',
    variant: 'destructive',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
