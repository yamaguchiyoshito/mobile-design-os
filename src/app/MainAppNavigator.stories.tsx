import type { Meta, StoryObj } from '@storybook/react-vite';

import { RootAppShell } from './RootAppShell';
import { MainAppNavigator } from './MainAppNavigator';

const meta: Meta<typeof MainAppNavigator> = {
  title: 'App/MainAppNavigator',
  component: MainAppNavigator,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <RootAppShell pathname={args.pathname}>
      <MainAppNavigator {...args} />
    </RootAppShell>
  ),
};

export default meta;

type Story = StoryObj<typeof MainAppNavigator>;

export const Search: Story = {
  args: {
    pathname: '/(main)/search',
  },
};

export const Settings: Story = {
  args: {
    pathname: '/(main)/profile/settings',
  },
};
