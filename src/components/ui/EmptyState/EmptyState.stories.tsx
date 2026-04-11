import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '../Icon';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 420, minHeight: 360 }}>
      <EmptyState {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: '検索結果がありません',
    description: '別のキーワードで試してください。',
  },
};

export const WithAction: Story = {
  args: {
    title: '保存済みの住所がありません',
    description: '注文を簡単にするため、配送先を追加してください。',
    illustration: <Icon name="info" size={48} color="#175CD3" accessible={false} />,
    action: {
      label: '住所を追加する',
      onPress: () => undefined,
    },
  },
};
