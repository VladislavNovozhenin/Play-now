import { Menu } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';
import { useTranslation } from 'react-i18next';
import PlayTrack from '@shared/assets/play-track.svg?react';
import Note from '@shared/assets/note.svg?react';
import './custom-menu.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHorizontalScroll } from '@shared/hooks/useHorizontalScroll';
import { UsePlaylists } from '@shared/hooks/usePlaylists';
import { useEffect } from 'react';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import { isNullOrUndefined } from '@shared/common/helpers';
import { HeartOutlined } from '@ant-design/icons';

export const CustomMenu = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useHorizontalScroll();
  const { showError } = useNotification();
  const { data: playlists, error } = UsePlaylists();

  useEffect(() => {
    if (error) {
      handleApiError(error, showError, t);
    }
  }, [error]);

  const menuItems = (): ItemType[] => {
    const base: ItemType[] = [
      { key: '/playlists', label: t('aside-menu.playlists'), icon: <Note width={24} height={24} /> },
      { key: '/tracks', label: t('aside-menu.tracks'), icon: <PlayTrack width={24} height={24} /> },
      { key: '/favorite', label: t('aside-menu.like-songs'), icon: <HeartOutlined /> },
    ];
    if (isNullOrUndefined(playlists)) return base;
    return [
      ...base,
      {
        key: 'playlist-group',
        label: 'Мои плейлисты',
        children: playlists.map((playlist) => ({ key: `/playlist/${playlist.id}`, label: playlist.name, icon: <Note width={24} height={24} /> })),
      },
    ];
  };

  return (
    <Menu
      ref={menuRef}
      overflowedIndicator={null}
      mode={'inline'}
      selectedKeys={[location.pathname]}
      className="aside-menu"
      items={menuItems()}
      onClick={({ key }) => navigate(key)}
    />
  );
};
