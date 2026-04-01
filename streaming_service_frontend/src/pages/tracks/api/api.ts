import { getBaseQuery, postBaseQuery } from '@shared/api/base-api';

const BASE_URL = import.meta.env.VITE_API;

const getTracksList = () => getBaseQuery(`${BASE_URL}/songs`);

const getTrack = (trackId: number) => getBaseQuery(`${BASE_URL}/songs/${trackId}`);

const likeSong = (songId: number) => postBaseQuery(`${BASE_URL}/songs/${songId}/like`);

const unLikeSong = (songId: number) => postBaseQuery(`${BASE_URL}/songs/${songId}/unlike`);

export const tracksAPI = {
  getTracksList,
  getTrack,
  likeSong,
  unLikeSong,
};

export const TRACKS_QUERY_KEYS = {
  TRACKS_LIST: 'TRACKS_LIST',
  TRACK: 'TRACK',
};
