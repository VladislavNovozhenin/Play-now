import { getBaseQuery } from '@shared/api/base-api';

const BASE_URL = import.meta.env.VITE_API;

const getTracksList = () => getBaseQuery(`${BASE_URL}/songs`);

const getTrack = (trackId: number) => getBaseQuery(`${BASE_URL}/songs/${trackId}`);

export const tracksAPI = {
  getTracksList,
  getTrack,
};

export const TRACKS_QUERY_KEYS = {
  TRACKS_LIST: 'TRACKS_LIST',
  TRACK: 'TRACK',
};
