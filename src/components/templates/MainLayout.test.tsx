import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { MainLayout } from './MainLayout';

describe('MainLayout', () => {
  test('header body footer の named slot を描画する', () => {
    const { getByText } = render(
      <MainLayout
        header={<div>header</div>}
        body={<div>body</div>}
        footer={<div>footer</div>}
      />,
    );

    expect(getByText('header')).toBeTruthy();
    expect(getByText('body')).toBeTruthy();
    expect(getByText('footer')).toBeTruthy();
  });
});
