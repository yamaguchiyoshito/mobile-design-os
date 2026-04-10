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
