import { useTracks } from './useTracks';
import { useLikesTracks } from './useLikesTracks';
import { usePlaylist } from './usePlaylist';
import type { PageQueue } from '@shared/ts/types';

export const useResolvedQueue = (source: { type: PageQueue; id?: string }) => {
  const { data: tracks } = useTracks(source.type === 'all');
  const { data: likes } = useLikesTracks(source.type === 'likes');
  const { data: playlist } = usePlaylist({ id: source.id, enabled: source.type === 'playlist' });

  switch (source.type) {
    case 'all':
      return tracks;
    case 'likes':
      return likes;
    case 'playlist':
      return playlist?.songs;
    default:
      return [];
  }
};
