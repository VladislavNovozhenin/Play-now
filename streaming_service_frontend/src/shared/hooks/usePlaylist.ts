import { PLAYLISTS_QUERY_KEYS, playlistsAPI } from '@shared/api/playlists-api';
import type { AppError, Playlist } from '@shared/ts/types';
import { useQuery } from '@tanstack/react-query';

type UsePlaylistProps = {
  id: string | undefined;
  enabled?: boolean;
};
export const usePlaylist = ({ id, enabled = true }: UsePlaylistProps) => {
  return useQuery<Playlist, AppError>({
    queryKey: [PLAYLISTS_QUERY_KEYS.PLAYLIST, id],
    queryFn: () => playlistsAPI.getPlaylist(id!),
    retry: false,
    enabled: enabled,
  });
};
