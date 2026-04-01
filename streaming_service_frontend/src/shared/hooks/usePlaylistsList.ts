import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@pages/playlists/api/api';
import type { IPlaylist } from '@shared/ts/types';
import { useGetUser } from '@store/useAppStore';
import { useQuery } from '@tanstack/react-query';

export const UsePlaylistsList = () => {
  const user = useGetUser();
  return useQuery<IPlaylist[]>({
    queryKey: [PLAYLISTS_QUERY_KEYS.PLAYLISTS_LIST],
    queryFn: () => playlistsAPI.getPlaylists(user!.username),
    retry: false,
    refetchOnMount: false,
  });
};
