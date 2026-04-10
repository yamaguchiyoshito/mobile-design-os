import type { Meta, StoryObj } from '@storybook/react-vite';

import { Banner } from '../components/ui';
import { MainAppNavigator } from './MainAppNavigator';
import { RootAppShell } from './RootAppShell';

const meta: Meta<typeof RootAppShell> = {
  title: 'App/RootAppShell',
  component: RootAppShell,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof RootAppShell>;

export const Default: Story = {
  args: {
    pathname: '/(main)/search',
    topBanner: <Banner type="info" message="メンテナンスは本日 23:00 から実施します" />,
    children: <MainAppNavigator pathname="/(main)/search" />,
  },
};
