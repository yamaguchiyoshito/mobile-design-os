import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { TextInput } from './TextInput';

describe('TextInput', () => {
  test('ラベル付き input として描画し変更を通知する', () => {
    const onChangeText = vi.fn();
    const { getByRole } = render(
      <TextInput label="メールアドレス" value="" onChangeText={onChangeText} />,
    );

    fireEvent.change(getByRole('textbox', { name: 'メールアドレス' }), {
      target: { value: 'hello@example.com' },
    });

    expect(onChangeText).toHaveBeenCalledWith('hello@example.com');
  });

  test('error があると invalid と alert を付与する', () => {
    const { getByRole } = render(
      <TextInput
        label="メールアドレス"
        value=""
        error="正しい形式で入力してください"
        onChangeText={() => undefined}
      />,
    );

    expect(getByRole('textbox', { name: 'メールアドレス' })).toHaveAttribute('aria-invalid', 'true');
    expect(getByRole('alert')).toHaveTextContent('正しい形式で入力してください');
  });
});
