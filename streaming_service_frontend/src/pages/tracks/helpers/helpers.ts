import type { IPlaylist } from '@shared/ts/types';

//Проверяем есть ли трек в каком-либо playlist
export const findTrackInPlaylists = (playlists: IPlaylist[], trackId: number) => {
  return playlists.some((playlist) => playlist.songs.some((track) => track.id === trackId));
};
