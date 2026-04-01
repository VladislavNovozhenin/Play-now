import { getBaseQuery, postBaseQuery } from '@shared/api/base-api';

const BASE_URL = import.meta.env.VITE_API;

const getPlaylists = (username: string) => getBaseQuery(`${BASE_URL}/users/${username}/playlists`);

const addPlaylist = (name: string) => postBaseQuery(`${BASE_URL}/playlists`, { name });

const addTrackInPlaylist = (playlistId: string, trackId: string) => postBaseQuery(`${BASE_URL}/${playlistId}/add/${trackId}`);

export const playlistsAPI = {
  getPlaylists,
  addPlaylist,
  addTrackInPlaylist
};

export const PLAYLISTS_QUERY_KEYS = {
  PLAYLISTS_LIST: 'PLAYLISTS_LIST',
};
