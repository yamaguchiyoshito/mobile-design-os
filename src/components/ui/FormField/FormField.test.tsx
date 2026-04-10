import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { FormField } from './FormField';

describe('FormField', () => {
  test('error が渡されたとき alert として表示する', () => {
    const { getByRole, getByText } = render(
      <FormField
        label="メールアドレス"
        value=""
        error="正しいメールアドレスを入力してください"
        onChangeText={vi.fn()}
      />,
    );

    expect(getByRole('alert')).toBeTruthy();
    expect(getByText('正しいメールアドレスを入力してください')).toBeTruthy();
  });

  test('error がないとき alert を表示しない', () => {
    const { queryByRole } = render(
      <FormField label="メールアドレス" value="" onChangeText={vi.fn()} />,
    );

    expect(queryByRole('alert')).toBeNull();
  });

  test('入力変更を onChangeText に伝える', () => {
    const onChangeText = vi.fn();
    const { getByRole } = render(
      <FormField label="メールアドレス" value="" onChangeText={onChangeText} />,
    );

    fireEvent.change(getByRole('textbox', { name: 'メールアドレス' }), {
      target: { value: 'coffee@example.com' },
    });

    expect(onChangeText).toHaveBeenCalledWith('coffee@example.com');
  });
});
