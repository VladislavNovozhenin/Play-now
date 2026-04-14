import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@shared/api/playlists-api';
import { NO_DATA } from '@shared/common/constants';
import { TracksList } from '@shared/components/tracks-list/TracksList';
import { TracksTable } from '@shared/components/tracks-table/TracksTable';
import { handleApiError } from '@shared/helpers/helpers';
import { useNotification } from '@shared/hooks/useNotification';
import type { Playlist } from '@shared/ts/types';
import { useQuery } from '@tanstack/react-query';
import { Grid, type MenuProps } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const { useBreakpoint } = Grid;
export const PlaylistPage = () => {
  const { id } = useParams();
  const { t } = useTranslation('common');
  const { showError } = useNotification();
  const { md, xl } = useBreakpoint();
  const [trackId, setTrackId] = useState<number | null>(null);
  const { data: playlist, error: playlistError } = useQuery<Playlist, unknown>({
    queryKey: [PLAYLISTS_QUERY_KEYS.PLAYLIST, id],
    queryFn: () => playlistsAPI.getPlaylist(id!),
    retry: false,
  });
  console.log(playlist);

  useEffect(() => {
    if (playlistError) {
      handleApiError(playlistError, showError, t);
    }
  }, [playlistError]);

  const getMenuItems = useCallback(
    (id: number): MenuProps['items'] => {
      return [{ key: 'remove', label: t('tracks-table.remove-from-playlist-btn'), onClick: () => setTrackId(id) }];
    },
    [t]
  );

  return (
    <>
      {md && <h1 className="title">{playlist?.name ?? NO_DATA}</h1>}
      {xl ? (
        <TracksTable tableData={playlist?.songs ?? []} getMenuItems={getMenuItems} />
      ) : (
        <TracksList listData={playlist?.songs ?? []} getMenuItems={getMenuItems} />
      )}
    </>
  );
};
