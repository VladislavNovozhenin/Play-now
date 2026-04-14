import type { MenuRef } from 'antd';
import { useRef, useEffect } from 'react';

export const useHorizontalScroll = () => {
  const menuRef = useRef<MenuRef>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');

    const enable = () => {
      const el = menuRef.current;
      if (!el?.menu?.list) return;

      const list = el.menu.list;

      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        list.scrollLeft += e.deltaY;
      };

      list.addEventListener('wheel', handleWheel, { passive: false });

      return () => list.removeEventListener('wheel', handleWheel);
    };

    let cleanup: undefined | (() => void);

    const onChange = () => {
      cleanup?.();
      if (mq.matches) cleanup = enable();
    };

    onChange();
    mq.addEventListener('change', onChange);

    return () => {
      mq.removeEventListener('change', onChange);
      cleanup?.();
    };
  }, []);

  return menuRef;
};
