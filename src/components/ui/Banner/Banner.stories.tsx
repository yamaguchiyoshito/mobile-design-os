import type { Meta, StoryObj } from '@storybook/react-vite';

import { Banner } from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'UI/Banner',
  component: Banner,
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <div style={{ width: 420 }}>
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
