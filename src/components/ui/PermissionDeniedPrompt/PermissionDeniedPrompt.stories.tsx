import type { Meta, StoryObj } from '@storybook/react-vite';

import { PermissionDeniedPrompt } from './PermissionDeniedPrompt';

const meta: Meta<typeof PermissionDeniedPrompt> = {
  title: 'UI/PermissionDeniedPrompt',
  component: PermissionDeniedPrompt,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div style={{ width: 420 }}>
      <PermissionDeniedPrompt {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof PermissionDeniedPrompt>;

export const Default: Story = {
  args: {
    featureName: 'カメラ',
    reason: 'プロフィール写真の撮影に使用します。',
    onOpenSettings: () => undefined,
    onDismiss: () => undefined,
  },
};
