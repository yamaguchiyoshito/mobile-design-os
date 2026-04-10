import { useEffect, useRef } from 'react';

import { notify } from '../lib/notify';

function getBrowserPath() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function useNotifyDismissOnNavigate(pathname?: string) {
  const resolvedPath = pathname ?? getBrowserPath();
  const previousPath = useRef(resolvedPath);

  useEffect(() => {
    if (previousPath.current !== resolvedPath) {
      notify.dismiss();
      previousPath.current = resolvedPath;
    }
  }, [resolvedPath]);
}
