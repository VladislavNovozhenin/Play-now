import { useTranslation } from 'react-i18next';
import { TracksTable } from '../shared/components/tracks-table/TracksTable';
import { useQuery } from '@tanstack/react-query';
import { TRACKS_QUERY_KEYS, tracksAPI } from '../shared/api/tracks-api';
import { Grid, type MenuProps } from 'antd';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import type { ModalState, Song } from '@shared/ts/types';
import { useNotification } from '@shared/hooks/useNotification';
import { handleApiError } from '@shared/helpers/helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { findTrackInPlaylists, isNullOrUndefined } from '@shared/common/helpers';
import { AddTrackModal } from '@shared/components/add-track-modal/AddTrackModal';
import { CreatePlaylistModal } from '@shared/components/create-playlist-modal/CreatePlaylistModal';
import { RemoveTrackModal } from '@shared/components/remove-track-modal/RemoveTrackModal';
import { UsePlaylists } from '@shared/hooks/usePlaylists';

const { useBreakpoint } = Grid;
export const TracksPage = () => {
  const { t } = useTranslation('common');
  const { xl, md } = useBreakpoint();
  const { showError } = useNotification();
  const [modalType, setModalType] = useState<ModalState>(null);
  const [trackId, setTrackId] = useState<number | null>(null);
  const { data: playlists, error: playlistError } = UsePlaylists();
  const { data: tracks, error: tracksError } = useQuery<Song[], unknown>({
    queryKey: [TRACKS_QUERY_KEYS.TRACKS_LIST],
    queryFn: () => tracksAPI.getTracksList(),
    retry: false,
  });

  useEffect(() => {
    if (tracksError) {
      handleApiError(tracksError, showError, t);
    }
    if (playlistError) {
      handleApiError(playlistError, showError, t);
    }
    handleCloseModal();
  }, [tracksError, playlistError]);

  const tracksInPlaylists = useMemo(() => {
    return findTrackInPlaylists(playlists);
  }, [playlists]);

  const getPlaylistsByTrack = useCallback(
    (trackId: number, include: boolean) => {
      return (playlists ?? []).filter((playlist) =>
        include ? tracksInPlaylists.get(trackId)?.has(playlist.id) : !tracksInPlaylists.get(trackId)?.has(playlist.id)
      );
    },
    [tracksInPlaylists]
  );

  const getMenuItems = useCallback(
    (trackId: number): MenuProps['items'] => {
      const trackCount = tracksInPlaylists.get(trackId)?.size ?? 0;

      if (isNullOrUndefined(playlists)) return [{ label: 'нет данных', key: 'no-data', disabled: true }];

      return [
        {
          label: t('tracks-table.add-in-playlist-btn'),
          key: 'add',
          onClick: () => {
            setTrackId(trackId);
            setModalType('add');
          },
          disabled: trackCount > 0 && playlists && trackCount === playlists?.length,
        },
        {
          label: t('tracks-table.remove-from-playlist-btn'),
          key: 'remove',
          onClick: () => {
            setTrackId(trackId);
            setModalType('remove');
          },
          disabled: trackCount === 0,
        },
      ];
    },
    [tracksInPlaylists, t]
  );

  const handleOpenModal = (type: ModalState) => {
    setModalType(type);
  };
  const handleCloseModal = () => {
    setModalType(null);
    setTrackId(null);
  };

  return (
    <>
      {md && <h1 className="title">{t('tracks-title')}</h1>}
      {xl ? <TracksTable tableData={tracks ?? []} getMenuItems={getMenuItems} /> : <TracksList getMenuItems={getMenuItems} listData={tracks ?? []} />}
      {modalType === 'add' && !isNullOrUndefined(trackId) && !isNullOrUndefined(playlists) && (
        <AddTrackModal
          getPlaylistsByTrack={getPlaylistsByTrack}
          isOpen={modalType === 'add'}
          onClose={handleCloseModal}
          openModal={handleOpenModal}
          trackId={trackId}
          playlists={playlists}
        />
      )}
      {modalType === 'remove' && !isNullOrUndefined(trackId) && !isNullOrUndefined(playlists) && (
        <RemoveTrackModal
          getPlaylistsByTrack={getPlaylistsByTrack}
          isOpen={modalType === 'remove'}
          onClose={handleCloseModal}
          trackId={trackId}
          playlists={playlists}
        />
      )}
      {modalType === 'createPlaylist' && !isNullOrUndefined(trackId) && !isNullOrUndefined(playlists) && (
        <CreatePlaylistModal isOpen={modalType === 'createPlaylist'} onClose={handleCloseModal} openModal={handleOpenModal} />
      )}
    </>
  );
};
