import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Snackbar } from './Snackbar';

const meta: Meta<typeof Snackbar> = {
  title: 'UI/Snackbar',
  component: Snackbar,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => {
    const [visible, setVisible] = useState(true);

    return (
      <div style={{ minHeight: '40vh', position: 'relative' }}>
        {visible ? <Snackbar {...args} onDismiss={() => setVisible(false)} /> : null}
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof Snackbar>;

export const Undo: Story = {
  args: {
    item: {
      id: 'snackbar-1',
      type: 'snackbar',
      message: 'アーカイブしました',
      action: {
        label: '元に戻す',
        onPress: () => undefined,
      },
    },
  },
};

export const Mobile320LongMessage: Story = {
  globals: {
    previewWidth: 'mobile320',
  },
  args: {
    item: {
      id: 'snackbar-2',
      type: 'snackbar',
      message:
        'アーカイブ済みの注文ログを元に戻しました。監査記録と表示順が再計算されるまで数秒かかる場合があります。',
      action: {
        label: '変更履歴を見る',
        onPress: () => undefined,
      },
    },
  },
};
