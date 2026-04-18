import type { Playlist } from '@shared/ts/types';
import { Link } from 'react-router-dom';
import Note from '@shared/assets/note.svg?react';
import './playlists-list.scss';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

type PlaylistsListProps = {
  playlists: Playlist[];
};
export const PlaylistsList = ({ playlists }: PlaylistsListProps) => {
  const { t } = useTranslation('common');
  return (
    <ul className="playlists-list">
      {playlists.map((playlist) => {
        return (
          <li className="playlists-list__item" key={playlist.id}>
            <Link className="playlists-list__link" to={`/playlist/${playlist.id}`}>
              <Note width={40} height={40} />
              <span className="playlists-list__name">{playlist.name}</span>
            </Link>
          </li>
        );
      })}
      <li className="playlists-list__item">
        <button className="playlists-list__btn">
          <PlusOutlined />
          <span className="playlists-list__name">{t('create-new-playlist')}</span>
        </button>
      </li>
    </ul>
  );
};
