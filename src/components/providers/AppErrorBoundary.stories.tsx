import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../ui';
import { AppErrorBoundary } from './AppErrorBoundary';

function BoundaryStoryFrame() {
  const [shouldCrash, setShouldCrash] = useState(false);

  return (
    <AppErrorBoundary
      onReset={() => {
        setShouldCrash(false);
      }}
    >
      {shouldCrash ? (
        (() => {
          throw new Error('Storybook crash demo');
        })()
      ) : (
        <Button
          label="クラッシュを発生させる"
          onPress={() => {
            setShouldCrash(true);
          }}
        />
      )}
    </AppErrorBoundary>
  );
}

const meta: Meta<typeof AppErrorBoundary> = {
  title: 'App/AppErrorBoundary',
  component: AppErrorBoundary,
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <div style={{ width: 360 }}>
      <BoundaryStoryFrame />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof AppErrorBoundary>;

export const Default: Story = {};
