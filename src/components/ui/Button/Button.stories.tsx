import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: '確認する',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive'],
      description: 'ボタンの見た目のバリエーション',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'ボタンの高さとラベル密度',
    },
    disabled: {
      control: 'boolean',
      description: '操作不能状態',
    },
    loading: {
      control: 'boolean',
      description: '処理中状態',
    },
    onPress: {
      action: 'pressed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    label: 'キャンセル',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    label: '削除する',
    variant: 'destructive',
  },
};

export const Small: Story = {
  args: {
    label: '小',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    label: '中',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    label: '大',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    label: '送信できません',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    label: '送信中',
    loading: true,
  },
};

export const LongLabel: Story = {
  args: {
    label: '非常に長いボタンラベルのテキストが入った場合の表示確認',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'カートに追加',
    iconLeft: 'shopping-cart',
  },
};
