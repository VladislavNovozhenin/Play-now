import { useTranslation } from 'react-i18next';
import { TracksTable } from '../shared/components/tracks-table/TracksTable';
import { useQuery } from '@tanstack/react-query';
import { TRACKS_QUERY_KEYS, tracksAPI } from '../shared/api/tracks-api';
import { Grid, type MenuProps } from 'antd';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import type { AppError, TracksModalState, Song } from '@shared/ts/types';
import { parseApiError } from '@shared/helpers/helpers';
import { useCallback, useMemo, useState } from 'react';
import { findTrackInPlaylists, isNullOrUndefined } from '@shared/common/helpers';
import { AddTrackModal } from '@shared/components/add-track-modal/AddTrackModal';
import { CreatePlaylistModal } from '@shared/components/create-playlist-modal/CreatePlaylistModal';
import { RemoveTrackModalWithPlaylists } from '@shared/components/remove-track-modal-with-playlists/RemoveTrackModalWithPlaylists';
import { usePlaylists } from '@shared/hooks/usePlaylists';
import { ErrorData } from '@shared/components/error-data/ErrorData';
import { Loader } from '@shared/components/loader/Loader';

const { useBreakpoint } = Grid;
export const TracksPage = () => {
  const { t } = useTranslation('common');
  const { xl, md } = useBreakpoint();
  const [modalType, setModalType] = useState<TracksModalState>(null);
  const [trackId, setTrackId] = useState<number | null>(null);
  const { data: playlists, error: playlistError } = usePlaylists();
  const {
    data: tracks,
    error: tracksError,
    refetch,
    isLoading,
  } = useQuery<Song[], AppError>({
    queryKey: [TRACKS_QUERY_KEYS.TRACKS_LIST],
    queryFn: () => tracksAPI.getTracksList(),
    retry: false,
  });

  const tracksErrorMessage = tracksError ? parseApiError(tracksError, t) : null;

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

      if (isNullOrUndefined(playlists) || playlistError) return [{ label: t('tracks-table.no-data'), key: 'no-data', disabled: true }];

      return [
        {
          label: t('tracks-table.add-in-playlist-btn'),
          key: 'add',
          onClick: (info) => {
            info.domEvent.stopPropagation();
            setTrackId(trackId);
            setModalType('add');
          },
          disabled: trackCount > 0 && playlists && trackCount === playlists?.length,
        },
        {
          label: t('tracks-table.remove-from-playlist-btn'),
          key: 'remove',
          onClick: (info) => {
            info.domEvent.stopPropagation();
            setTrackId(trackId);
            setModalType('remove');
          },
          disabled: trackCount === 0,
        },
      ];
    },
    [tracksInPlaylists, t, playlistError]
  );

  const handleOpenModal = (type: TracksModalState) => {
    setModalType(type);
  };
  const handleCloseModal = () => {
    setModalType(null);
    setTrackId(null);
  };

  if (tracksErrorMessage) return <ErrorData title={tracksErrorMessage} btnTitle={t('errors.retry-btn')} onClick={refetch} />;
  if (isLoading) return <Loader />;

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
        <RemoveTrackModalWithPlaylists
          getPlaylistsByTrack={getPlaylistsByTrack}
          isOpen={modalType === 'remove'}
          onClose={handleCloseModal}
          trackId={trackId}
        />
      )}
      {modalType === 'createPlaylist' && !isNullOrUndefined(trackId) && !isNullOrUndefined(playlists) && (
        <CreatePlaylistModal isOpen={modalType === 'createPlaylist'} onClose={handleCloseModal} openModal={handleOpenModal} />
      )}
    </>
  );
};
