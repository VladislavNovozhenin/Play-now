import { getBaseQuery, postBaseQuery } from '@shared/api/base-api';
import type { Song } from '@shared/ts/types';

const BASE_URL = import.meta.env.VITE_API;

const getTracksList = (): Promise<Song[]> => getBaseQuery(`${BASE_URL}/songs`);

const getTrack = (trackId: number): Promise<Song> => getBaseQuery(`${BASE_URL}/songs/${trackId}`);

const likeSong = (songId: number): Promise<Song> => postBaseQuery(`${BASE_URL}/songs/${songId}/like`);

const unLikeSong = (songId: number): Promise<Song> => postBaseQuery(`${BASE_URL}/songs/${songId}/unlike`);

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
