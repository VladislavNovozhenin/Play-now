import { useQuery } from '@tanstack/react-query';
import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from './api/api';
import { useGetUser } from '@store/useAppStore';
import type { Playlist } from '@shared/ts/types';
import { useEffect } from 'react';
import { handleApiError } from '@shared/helpers/helpers';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@shared/hooks/useNotification';

export const PlaylistsPage = () => {
  const user = useGetUser();
  const { t } = useTranslation('common');
  const { showError } = useNotification();
  const { data, error } = useQuery<Playlist[], unknown>({
    queryKey: [PLAYLISTS_QUERY_KEYS.PLAYLISTS_LIST],
    queryFn: () => playlistsAPI.getPlaylists(user!.username),
    retry: false,
  });

  useEffect(() => {
    if (error) {
      handleApiError(error, showError, t, 'playlists');
    }
  }, [error]);

  return <></>;
};
