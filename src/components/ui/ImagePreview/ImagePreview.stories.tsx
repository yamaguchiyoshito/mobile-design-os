import type { Meta, StoryObj } from '@storybook/react-vite';

import { ImagePreview } from './ImagePreview';

const meta: Meta<typeof ImagePreview> = {
  title: 'UI/ImagePreview',
  component: ImagePreview,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ImagePreview>;

export const Default: Story = {
  args: {
    uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    onRemove: () => undefined,
  },
};
