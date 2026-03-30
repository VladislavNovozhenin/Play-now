import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@pages/playlists/api/api';
import type { IPlaylist } from '@shared/ts/types';
import { useQuery } from '@tanstack/react-query';

export const UsePlaylistsList = () =>
  useQuery<IPlaylist[]>({
    queryKey: [PLAYLISTS_QUERY_KEYS.PLAYLISTS_LIST],
    queryFn: () => playlistsAPI.getPlaylists(),
    retry: false,
    refetchOnMount: false,
  });
