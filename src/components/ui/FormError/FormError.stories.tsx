import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormError } from './FormError';

const meta: Meta<typeof FormError> = {
  title: 'UI/FormError',
  component: FormError,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <FormError {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof FormError>;

export const Default: Story = {
  args: {
    message: '入力内容に誤りがあります。内容を確認してください。',
  },
};
