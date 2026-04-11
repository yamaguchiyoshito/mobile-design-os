import type { Meta, StoryObj } from '@storybook/react-vite';

import { ErrorState } from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'UI/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 420, minHeight: 360 }}>
      <ErrorState {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {
    message: '接続を確認してください',
  },
};

export const WithRetry: Story = {
  args: {
    message: '注文一覧を取得できませんでした',
    onRetry: () => undefined,
  },
};
