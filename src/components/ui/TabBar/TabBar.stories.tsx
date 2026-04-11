import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { TabBar } from './TabBar';

const items = [
  { key: 'home', label: 'ホーム', icon: 'home' as const },
  { key: 'search', label: '検索', icon: 'search' as const },
  { key: 'notifications', label: '通知', icon: 'bell' as const, badge: 3 },
  { key: 'profile', label: '設定', icon: 'user' as const },
];

const meta: Meta<typeof TabBar> = {
  title: 'UI/TabBar',
  component: TabBar,
  parameters: {
    layout: 'centered',
  },
  args: {
    items,
    activeKey: 'home',
  },
  render: (args) => {
    const [activeKey, setActiveKey] = useState(args.activeKey);

    return (
      <div style={{ width: '100%', maxWidth: 420 }}>
        <TabBar {...args} activeKey={activeKey} onChange={setActiveKey} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof TabBar>;

export const Default: Story = {};

export const NotificationsActive: Story = {
  args: {
    activeKey: 'notifications',
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...items.slice(0, 3),
      { key: 'profile', label: '設定', icon: 'user', disabled: true },
    ],
  },
};
