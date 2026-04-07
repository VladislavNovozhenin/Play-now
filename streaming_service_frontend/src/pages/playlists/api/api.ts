import { getBaseQuery, postBaseQuery } from '@shared/api/base-api';
import type { Playlist } from '@shared/ts/types';

const BASE_URL = import.meta.env.VITE_API;

const getPlaylists = (username: string): Promise<Playlist[]> => getBaseQuery(`${BASE_URL}/users/${username}/playlists`);

const createPlaylist = (name: string) => postBaseQuery(`${BASE_URL}/playlists`, { name });

const addTrackInPlaylist = (playlistId: string, trackId: string) => postBaseQuery(`${BASE_URL}/${playlistId}/add/${trackId}`);

export const playlistsAPI = {
  getPlaylists,
  createPlaylist,
  addTrackInPlaylist,
};

export const PLAYLISTS_QUERY_KEYS = {
  PLAYLISTS_LIST: 'PLAYLISTS_LIST',
};
