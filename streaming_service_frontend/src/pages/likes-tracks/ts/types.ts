import type { Album, Artist, Song } from '@shared/ts/types';

export interface LikesResponse {
  artistLikes: Artist[];
  albumLikes: Album[];
  songLikes: Song[];
}
