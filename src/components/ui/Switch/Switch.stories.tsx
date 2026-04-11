import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Switch {...args} />
    </div>
  ),
  args: {
    value: true,
    label: 'プッシュ通知を受け取る',
    description: '配送状況の更新をリアルタイムで受け取ります。',
  },
  argTypes: {
    value: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    onChange: {
      action: 'changed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Enabled: Story = {};

export const Off: Story = {
  args: {
    value: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
