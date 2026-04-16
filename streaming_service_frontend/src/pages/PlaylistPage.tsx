import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@shared/api/playlists-api';
import { NO_DATA } from '@shared/common/constants';
import { isNullOrUndefined } from '@shared/common/helpers';
import { ErrorData } from '@shared/components/error-data/ErrorData';
import { RemoveTrackModalWithoutPlaylists } from '@shared/components/remove-track-modal-without-playlists/RemoveTrackModalWithoutPlaylists';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import { TracksTable } from '@shared/components/tracks-table/TracksTable';
import { parseApiError } from '@shared/helpers/helpers';
import type { AppError, Playlist } from '@shared/ts/types';
import { useQuery } from '@tanstack/react-query';
import { Empty, Grid, type MenuProps } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const { useBreakpoint } = Grid;
export const PlaylistPage = () => {
  const { id } = useParams();
  const { t } = useTranslation('common');
  const { md, xl } = useBreakpoint();
  const [trackId, setTrackId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const {
    data: playlist,
    error: playlistError,
    refetch,
  } = useQuery<Playlist, AppError>({
    queryKey: [PLAYLISTS_QUERY_KEYS.PLAYLIST, id],
    queryFn: () => playlistsAPI.getPlaylist(id!),
    retry: false,
  });

  const playlistErrorMessage = playlistError ? parseApiError(playlistError, t) : null;

  const handleOpenModal = (id: number) => {
    setOpenModal(true);
    setTrackId(id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTrackId(null);
  };

  const getMenuItems = useCallback(
    (id: number): MenuProps['items'] => {
      return [{ key: 'remove', label: t('tracks-table.remove-from-playlist-btn'), onClick: () => handleOpenModal(id) }];
    },
    [t]
  );

  if (playlistErrorMessage) return <ErrorData title={playlistErrorMessage} btnTitle={t('errors.retry-btn')} onClick={refetch} />;

  if (playlist?.songs?.length === 0) return <Empty description={t('empty')} />;

  return (
    <>
      {md && <h1 className="title">{playlist?.name ?? NO_DATA}</h1>}
      {xl ? (
        <TracksTable tableData={playlist?.songs ?? []} getMenuItems={getMenuItems} />
      ) : (
        <TracksList listData={playlist?.songs ?? []} getMenuItems={getMenuItems} />
      )}
      {openModal && !isNullOrUndefined(trackId) && playlist?.id && (
        <RemoveTrackModalWithoutPlaylists isOpen={openModal} trackId={trackId} onClose={handleCloseModal} playlistId={playlist?.id} />
      )}
    </>
  );
};
