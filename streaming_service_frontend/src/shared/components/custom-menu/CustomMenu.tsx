import { Grid, Menu } from 'antd';
import type { MenuItemType } from 'antd/es/menu/interface';
import { useTranslation } from 'react-i18next';
import PlayTrack from '@shared/assets/play-track.svg?react';
import Note from '@shared/assets/note.svg?react';
import './custom-menu.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useHorizontalScroll } from '@shared/hooks/useHorizontalScroll';

const { useBreakpoint } = Grid;

export const CustomMenu = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();
  const { md } = useBreakpoint();
  const menuRef = useHorizontalScroll();

  const menuItems: MenuItemType[] = [
    { key: '/playlists', label: t('playlists'), icon: <Note /> },
    { key: '/tracks', label: t('tracks'), icon: <PlayTrack /> },
    { key: '/favorite', label: t('favorite-songs') },
  ];

  return (
    <Menu
      ref={menuRef}
      overflowedIndicator={null}
      mode={'vertical'}
      selectedKeys={[location.pathname]}
      className={clsx('aside-menu', {
        'aside-menu--mobile': !md,
      })}
      items={menuItems}
      onClick={({ key }) => navigate(`/${key}`)}
    />
  );
};
