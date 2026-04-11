import type { Meta, StoryObj } from '@storybook/react-vite';

import { Banner } from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'UI/Banner',
  component: Banner,
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Banner {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  args: {
    type: 'info',
    message: 'この機能はプレビュー版です',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    message: '現在オフラインです。一部機能は利用できません',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    message: '強制アップデートが必要です',
    action: {
      label: '更新する',
      onPress: () => undefined,
    },
    onDismiss: () => undefined,
  },
};

export const Mobile320LongMessage: Story = {
  globals: {
    previewWidth: 'mobile320',
  },
  args: {
    type: 'warning',
    message:
      '配送先住所の確認が完了していないため、出荷処理を保留しています。注文詳細から修正依頼の履歴を確認してください。',
    action: {
      label: '注文詳細を開く',
      onPress: () => undefined,
    },
    onDismiss: () => undefined,
  },
};
