import { isIterableArray } from '@shared/common/helpers';
import type { Song } from '@shared/ts/types';
import { useEffect } from 'react';

type useAutoLoadOnResizeProps = {
  isShowMore: boolean;
  visibleData: Song[];
  showMore: () => void;
};
export const useAutoLoadOnResize = ({ isShowMore, visibleData, showMore }: useAutoLoadOnResizeProps) => {
  useEffect(() => {
    const checkSizeWindow = () => {
      const windowHeight = window.innerHeight;
      const documentHeigth = document.documentElement.scrollHeight;
      if (windowHeight >= documentHeigth && isShowMore) {
        showMore();
      }
    };
    if (isIterableArray(visibleData)) {
      checkSizeWindow();
    }
    window.addEventListener('resize', checkSizeWindow);
    return () => window.removeEventListener('resize', checkSizeWindow);
  }, [visibleData.length]);
};
