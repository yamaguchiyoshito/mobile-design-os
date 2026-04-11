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

export const Mobile320LongCopy: Story = {
  globals: {
    previewWidth: 'mobile320',
  },
  args: {
    item: {
      title: '返金処理を完了として記録しますか？',
      message:
        '返品商品の検品結果が反映され、カード会社への返金依頼も送信済みになります。顧客向け通知と監査ログに同時に反映されるため、処理内容を再確認してください。',
      confirmLabel: '返金完了として記録する',
      cancelLabel: '内容を見直す',
      destructive: false,
      onConfirm: () => undefined,
    },
  },
};
