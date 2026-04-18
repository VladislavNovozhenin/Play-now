import { Grid, Menu } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';
import { useTranslation } from 'react-i18next';
import PlayTrack from '@shared/assets/play-track.svg?react';
import Note from '@shared/assets/note.svg?react';
import './custom-menu.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { UsePlaylists } from '@shared/hooks/usePlaylists';
import { useMemo } from 'react';
import { isNullOrUndefined } from '@shared/common/helpers';
import { HeartOutlined } from '@ant-design/icons';

const { useBreakpoint } = Grid;
export const CustomMenu = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();
  const { md } = useBreakpoint();
  const { data: playlists, error: playlistsError } = UsePlaylists();

  const menuItems = useMemo((): ItemType[] => {
    const base: ItemType[] = [
      { key: '/playlists', label: t('aside-menu.playlists'), icon: <Note width={18} height={18} /> },
      { key: '/tracks', label: t('aside-menu.tracks'), icon: <PlayTrack width={18} height={18} /> },
      { key: '/favorite', label: t('aside-menu.like-songs'), icon: <HeartOutlined /> },
    ];
    if (isNullOrUndefined(playlists) || playlistsError) return base;
    if (md) {
      return [
        ...base,
        {
          key: 'playlist-group',
          label: t('aside-menu.my-playlists'),
          children: playlists.map((playlist) => ({ key: `/playlist/${playlist.id}`, label: playlist.name, icon: <Note width={18} height={18} /> })),
        },
      ];
    }
    return [
      ...base,
      ...playlists.map((playlist) => ({ key: `/playlist/${playlist.id}`, label: playlist.name, icon: <Note width={24} height={24} /> })),
    ];
  }, [playlists, md, t, playlistsError]);

  return (
    <Menu
      overflowedIndicator={null}
      mode={'inline'}
      selectedKeys={[location.pathname]}
      className="aside-menu"
      items={menuItems}
      onClick={({ key }) => navigate(key)}
    />
  );
};
