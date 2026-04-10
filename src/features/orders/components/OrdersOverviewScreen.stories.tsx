import type { Meta, StoryObj } from '@storybook/react-vite';

import { OrdersOverviewScreen } from './OrdersOverviewScreen';

const meta: Meta<typeof OrdersOverviewScreen> = {
  title: 'Feature/Orders/OrdersOverviewScreen',
  component: OrdersOverviewScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof OrdersOverviewScreen>;

export const Default: Story = {
  args: {
    onOpenOrder: () => undefined,
  },
};

export const ActionRequiredOnly: Story = {
  args: {
    onOpenOrder: () => undefined,
    filter: 'action-required',
  },
};
