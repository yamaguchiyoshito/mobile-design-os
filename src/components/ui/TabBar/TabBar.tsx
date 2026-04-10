import type { CSSProperties } from 'react';

import { useTheme } from '../../providers/ThemeProvider';
import tokens from '../../../tokens';
import { Icon, type IconName } from '../Icon';
import { Text } from '../Text';

export type TabBarItem = {
  key: string;
  label: string;
  icon?: IconName;
  badge?: number;
  disabled?: boolean;
};

export type TabBarProps = {
  items: TabBarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  ariaLabel?: string;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function TabBar({
  items,
  activeKey,
  onChange,
  ariaLabel = 'メインナビゲーション',
  testID,
  style,
  className,
}: TabBarProps) {
  const { palette } = useTheme();

  return (
    <nav
      aria-label={ariaLabel}
      data-testid={testID}
      className={className}
      style={{
        width: '100%',
        padding: tokens.space2,
        borderRadius: tokens.radiusLg,
        border: `1px solid ${palette.borderDefault}`,
        backgroundColor: palette.surfacePrimary,
        boxShadow: palette.cardShadow,
        ...style,
      }}
    >
      <div role="tablist" aria-label={ariaLabel} style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: tokens.space2 }}>
        {items.map((item) => {
          const selected = item.key === activeKey;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-label={item.label}
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) {
                  onChange(item.key);
                }
              }}
              style={{
                minHeight: 60,
                border: 'none',
                borderRadius: tokens.radiusMd,
                backgroundColor: selected ? tokens.colorSurfaceBrandSubtle : 'transparent',
                color: selected
                  ? tokens.colorContentBrand
                  : item.disabled
                    ? palette.contentDisabled
                    : palette.contentSecondary,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                position: 'relative',
              }}
            >
              {item.icon ? (
                <Icon
                  name={item.icon}
                  size={20}
                  color={
                    selected
                      ? tokens.colorContentBrand
                      : item.disabled
                        ? palette.contentDisabled
                        : palette.contentSecondary
                  }
                  accessible={false}
                />
              ) : null}
              <Text
                as="span"
                variant="labelSm"
                tone={selected ? 'brand' : item.disabled ? 'disabled' : 'secondary'}
              >
                {item.label}
              </Text>
              {typeof item.badge === 'number' && item.badge > 0 ? (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 18,
                    minWidth: 18,
                    height: 18,
                    paddingInline: 5,
                    borderRadius: 999,
                    backgroundColor: tokens.colorSurfaceDanger,
                    color: tokens.colorContentInverse,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
