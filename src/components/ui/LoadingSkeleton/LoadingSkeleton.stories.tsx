import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoadingSkeleton } from './LoadingSkeleton';

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'UI/LoadingSkeleton',
  component: LoadingSkeleton,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <LoadingSkeleton {...args} />
    </div>
  ),
  args: {
    itemCount: 3,
    showHeader: true,
    showSearchBar: true,
  },
};

export default meta;

type Story = StoryObj<typeof LoadingSkeleton>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    itemCount: 2,
    showHeader: false,
  },
};
