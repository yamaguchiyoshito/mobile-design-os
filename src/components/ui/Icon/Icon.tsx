import type { CSSProperties, SVGProps } from 'react';

import tokens from '../../../tokens';

const iconRegistry = {
  bell: (
    <>
      <path d="M8.6 17.4h6.8" />
      <path d="M6.5 16.8V11c0-3.1 2.2-5.5 5.5-5.5s5.5 2.4 5.5 5.5v5.8l1.3 1.5c.4.4.1 1.2-.5 1.2H5.7c-.7 0-.9-.8-.5-1.2l1.3-1.5Z" />
      <path d="M10.2 19.4a1.9 1.9 0 0 0 3.6 0" />
    </>
  ),
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.2 2.2 4.8-5.1" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  home: (
    <>
      <path d="m4.5 10.2 7.5-6.2 7.5 6.2" />
      <path d="M6.8 9.7V19h10.4V9.7" />
      <path d="M10 19v-5.1h4V19" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.2v5.3" />
      <circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="5.8" />
      <path d="m15.5 15.5 3.8 3.8" />
    </>
  ),
  'shopping-cart': (
    <>
      <circle cx="9" cy="18" r="1.3" />
      <circle cx="17" cy="18" r="1.3" />
      <path d="M3.5 5H6l1.8 8h8.2l2.1-6H7.2" />
    </>
  ),
  trash: (
    <>
      <path d="M5 7h14" />
      <path d="M9 7V5.7c0-.7.6-1.2 1.2-1.2h3.6c.7 0 1.2.5 1.2 1.2V7" />
      <path d="M7.5 7.5 8.2 18c.1.8.7 1.5 1.6 1.5h4.4c.8 0 1.5-.6 1.6-1.5l.7-10.5" />
      <path d="M10 10.5v5.5" />
      <path d="M14 10.5v5.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.2" r="3.1" />
      <path d="M5.3 18.4c1.5-2.7 3.8-4.1 6.7-4.1s5.2 1.4 6.7 4.1" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4.5 3.9 18.2c-.3.6.1 1.3.8 1.3h14.6c.7 0 1.2-.7.8-1.3L12 4.5Z" />
      <path d="M12 9.2v4.6" />
      <circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  'wifi-off': (
    <>
      <path d="M3.5 8.5a13.5 13.5 0 0 1 14.8-1.3" />
      <path d="M6.5 11.7a9.2 9.2 0 0 1 7 0" />
      <path d="m2.5 3 19 18" />
      <path d="M12 18.5h.01" />
    </>
  ),
  x: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
} as const;

export type IconName = keyof typeof iconRegistry;

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  size?: number;
  color?: string;
  testID?: string;
  accessible?: boolean;
};

export function Icon({
  name,
  size = 24,
  color = tokens.colorContentPrimary,
  testID,
  accessible = true,
  style,
  ...rest
}: IconProps) {
  const iconStyle: CSSProperties = {
    display: 'inline-block',
    flexShrink: 0,
    color,
    ...style,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-testid={testID}
      aria-hidden={accessible ? undefined : true}
      role={accessible ? 'img' : undefined}
      focusable="false"
      style={iconStyle}
      {...rest}
    >
      {iconRegistry[name]}
    </svg>
  );
}
