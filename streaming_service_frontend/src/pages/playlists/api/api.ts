import { getBaseQuery, postBaseQuery } from '@shared/api/base-api';
import type { Playlist } from '@shared/ts/types';

const BASE_URL = import.meta.env.VITE_API;

const getPlaylists = (username: string): Promise<Playlist[]> => getBaseQuery(`${BASE_URL}/users/${username}/playlists`);

const createPlaylist = (name: string) => postBaseQuery(`${BASE_URL}/playlists`, { name });

const addTrackInPlaylist = (playlistId: number, trackId: number) => postBaseQuery(`${BASE_URL}/playlists/${playlistId}/add/${trackId}`);

const removeTrackFromPlaylist = (playlistId: number, trackId: number) => postBaseQuery(`${BASE_URL}/playlists/${playlistId}/remove/${trackId}`);

export const playlistsAPI = {
  getPlaylists,
  createPlaylist,
  addTrackInPlaylist,
  removeTrackFromPlaylist,
};

export const PLAYLISTS_QUERY_KEYS = {
  PLAYLISTS_LIST: 'PLAYLISTS_LIST',
};
