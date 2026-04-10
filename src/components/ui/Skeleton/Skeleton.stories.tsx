import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div
      aria-label="読み込み中"
      style={{
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Skeleton {...args} />
      <Skeleton height={72} radius={12} />
      <Skeleton height={72} radius={12} />
      <Skeleton width="72%" />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    height: 16,
    radius: 8,
  },
};
