import type { Playlist, PlaylistsModalState } from '@shared/ts/types';
import { Link } from 'react-router-dom';
import Note from '@shared/assets/note.svg?react';
import './playlists-list.scss';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useGetSearchValue } from '@store/useAppStore';

type PlaylistsListProps = {
  playlists: Playlist[];
  openModal: (type: PlaylistsModalState) => void;
  tooglePlaylistId: (id: number) => void;
};
export const PlaylistsList = ({ playlists, openModal, tooglePlaylistId }: PlaylistsListProps) => {
  const { t } = useTranslation('common');
  const searchValue = useGetSearchValue();

  const filterPlaylists = useMemo(
    () => playlists.filter((playlist) => playlist.name.toLowerCase().includes(searchValue.toLowerCase())),
    [playlists, searchValue]
  );
  return (
    <ul className="playlists-list">
      {filterPlaylists.map((playlist) => {
        return (
          <li className="playlists-list__item" key={playlist.id}>
            <button
              onClick={() => {
                tooglePlaylistId(playlist.id);
                openModal('remove');
              }}
              className="playlists-list__btn-delete">
              <CloseOutlined />
            </button>
            <Link className="playlists-list__link" to={`/playlist/${playlist.id}`}>
              <Note width={40} height={40} />
              <span className="playlists-list__name">{playlist.name}</span>
            </Link>
          </li>
        );
      })}
      <li className="playlists-list__item">
        <button onClick={() => openModal('add')} className="playlists-list__btn-add">
          <PlusOutlined />
          <span className="playlists-list__name">{t('create-new-playlist')}</span>
        </button>
      </li>
    </ul>
  );
};
