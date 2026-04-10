import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
  test('heading body footer の named slot を描画する', () => {
    const { getByText } = render(
      <AuthLayout heading={<div>heading</div>} body={<div>body</div>} footer={<div>footer</div>} />,
    );

    expect(getByText('heading')).toBeTruthy();
    expect(getByText('body')).toBeTruthy();
    expect(getByText('footer')).toBeTruthy();
  });
});
