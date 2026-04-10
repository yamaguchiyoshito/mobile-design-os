import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import type { ToastItem } from '../../../stores/notifyStore';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => {
    const [visible, setVisible] = useState(true);

    return (
      <div style={{ minHeight: '40vh', position: 'relative' }}>
        {visible ? <Toast {...args} onDismiss={() => setVisible(false)} /> : null}
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

const baseItem: ToastItem = {
  id: 'toast-1',
  type: 'success',
  message: '保存しました',
};

export const Success: Story = {
  args: {
    item: baseItem,
  },
};

export const Error: Story = {
  args: {
    item: {
      ...baseItem,
      id: 'toast-2',
      type: 'error',
      message: '保存できませんでした。もう一度お試しください',
    },
  },
};
