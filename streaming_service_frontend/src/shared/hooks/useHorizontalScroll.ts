import type { MenuRef } from 'antd';
import { useRef, useEffect } from 'react';

export const useHorizontalScroll = () => {
  const menuRef = useRef<MenuRef>(null);
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      if (el.menu?.list) {
        el.menu.list.scrollLeft += e.deltaY;
      }
    };

    if (el.menu?.list) {
      const list = el.menu.list;
      list.addEventListener('wheel', handleWheel, { passive: false });
      return () => list.removeEventListener('wheel', handleWheel);
    }
  }, []);
  return menuRef;
};
