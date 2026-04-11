import type { Meta, StoryObj } from '@storybook/react-vite';

import { LogoutButton } from './LogoutButton';

const meta: Meta<typeof LogoutButton> = {
  title: 'Feature/Auth/LogoutButton',
  component: LogoutButton,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <LogoutButton {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof LogoutButton>;

export const Default: Story = {};
