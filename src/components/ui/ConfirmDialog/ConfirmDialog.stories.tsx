import type { Meta, StoryObj } from '@storybook/react-vite';

import { ConfirmDialog } from './ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'UI/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

export const Destructive: Story = {
  args: {
    item: {
      title: '注文を削除しますか？',
      message: 'この操作は取り消せません',
      confirmLabel: '削除する',
      cancelLabel: 'キャンセル',
      destructive: true,
      onConfirm: () => undefined,
    },
  },
};
