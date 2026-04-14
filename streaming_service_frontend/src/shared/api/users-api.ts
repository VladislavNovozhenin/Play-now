import { getBaseQuery } from '@shared/api/base-api';
import type { LikesResponse, Playlist } from '@shared/ts/types';

const BASE_URL = import.meta.env.VITE_API;

const getLikesList = (username: string): Promise<LikesResponse> => getBaseQuery(`${BASE_URL}/users/${username}/likes`);
const getPlaylists = (username: string): Promise<Playlist[]> => getBaseQuery(`${BASE_URL}/users/${username}/playlists`);

export const usersAPI = {
  getLikesList,
  getPlaylists,
};

export const USERS_QUERY_KEYS = {
  LIKES_LIST: 'LIKES_LIST',
  PLAYLISTS_LIST: 'PLAYLISTS_LIST',
};
