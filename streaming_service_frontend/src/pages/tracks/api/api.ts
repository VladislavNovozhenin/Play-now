import { getBaseQuery } from '@shared/api/base-api';

const BASE_URL = import.meta.env.VITE_API;

const getTracksList = () => getBaseQuery(`${BASE_URL}/songs`);

export const tracksAPI = {
  getTracksList,
};

export const TRACKS_QUERY_KEYS = {
  TRACKS_LIST: 'TRACKS_LIST',
};

