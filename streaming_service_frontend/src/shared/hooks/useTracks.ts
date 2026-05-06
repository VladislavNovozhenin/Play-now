import { TRACKS_QUERY_KEYS, tracksAPI } from '@shared/api/tracks-api';
import type { AppError, Song } from '@shared/ts/types';
import { useQuery } from '@tanstack/react-query';

export const useTracks = (enabled: boolean = true) => {
  return useQuery<Song[], AppError>({
    queryKey: [TRACKS_QUERY_KEYS.TRACKS_LIST],
    queryFn: () => tracksAPI.getTracksList(),
    retry: false,
    enabled: enabled
  });
};
