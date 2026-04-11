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

export const Mobile320LongMessage: Story = {
  globals: {
    previewWidth: 'mobile320',
  },
  args: {
    item: {
      id: 'toast-3',
      type: 'warning',
      message:
        '購入手続きは完了していません。カード会社アプリで認証待ちの決済を確認し、処理後に再度この画面を開いてください。',
    },
  },
};
