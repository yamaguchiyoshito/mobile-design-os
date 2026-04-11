import type { Meta, StoryObj } from '@storybook/react-vite';

import { OrderDetailScreen } from './OrderDetailScreen';

const meta: Meta<typeof OrderDetailScreen> = {
  title: 'Feature/Orders/OrderDetailScreen',
  component: OrderDetailScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof OrderDetailScreen>;

export const Default: Story = {
  args: {
    orderId: 'order-1001',
    transactionId: 'txn-100',
    amountLabel: '¥12,800',
    onBackToOrders: () => undefined,
  },
};

export const Shipped: Story = {
  args: {
    orderId: 'order-1002',
    transactionId: 'txn-200',
    onBackToOrders: () => undefined,
  },
};

export const PaymentPending: Story = {
  args: {
    orderId: 'order-1003',
    onBackToOrders: () => undefined,
    onResumePayment: () => undefined,
  },
};

export const Mobile390: Story = {
  globals: {
    previewWidth: 'mobile390',
  },
  args: {
    orderId: 'order-1001',
    transactionId: 'txn-100',
    amountLabel: '¥12,800',
    onBackToOrders: () => undefined,
  },
};
