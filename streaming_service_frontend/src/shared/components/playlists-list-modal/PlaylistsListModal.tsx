import type { Playlist } from '@shared/ts/types';
import PlaylistSvg from '@shared/assets/play-track.svg?react';
import { useTranslation } from 'react-i18next';
import './playlists-list-modal.scss';
import clsx from 'clsx';

type PlaylistsListModalProps = {
  playlists: Playlist[];
  handleChangePlaylistId: (id: number) => void;
  selectedPlaylistId: number | null;
};
export const PlaylistsListModal = ({ playlists, handleChangePlaylistId, selectedPlaylistId }: PlaylistsListModalProps) => {
  const { t } = useTranslation('common');
  return (
    <ul className="playlists-list">
      {playlists.map((playlist) => {
        return (
          <li className="playlists-list__item" key={playlist.id}>
            <button
              className={clsx('playlists-list__btn', playlist.id === selectedPlaylistId && 'playlists-list__btn-selected')}
              onClick={() => handleChangePlaylistId(playlist.id)}>
              <PlaylistSvg width={50} height={50} />
              <div className="playlists-list__info">
                <span>{playlist.name}</span>
                <span>
                  {playlist.songs.length > 0 ? t('count-tracks.count-tracks', { count: playlist.songs.length }) : t('count-tracks.count-tracks_zero')}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
