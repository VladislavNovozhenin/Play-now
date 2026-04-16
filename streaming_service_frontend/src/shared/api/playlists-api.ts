import { getBaseQuery, postBaseQuery } from '@shared/api/base-api';

const BASE_URL = import.meta.env.VITE_API;

const createPlaylist = (name: string) => postBaseQuery(`${BASE_URL}/playlists`, { name });

const addTrackInPlaylist = (playlistId: number, trackId: number) => postBaseQuery(`${BASE_URL}/playlists/${playlistId}/add/${trackId}`);

const removeTrackFromPlaylist = (playlistId: number, trackId: number) => postBaseQuery(`${BASE_URL}/playlists/${playlistId}/remove/${trackId}`);

const getPlaylist = (playlistId: string) => getBaseQuery(`${BASE_URL}/playlists/${playlistId}`);

export const playlistsAPI = {
  createPlaylist,
  addTrackInPlaylist,
  removeTrackFromPlaylist,
  getPlaylist,
};

export const PLAYLISTS_QUERY_KEYS = {
  PLAYLIST: 'PLAYLIST',
};
