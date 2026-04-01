import { getBaseQuery } from '@shared/api/base-api';

const BASE_URL = import.meta.env.VITE_API;

const getLikesList = (username: string) => getBaseQuery(`${BASE_URL}/users/${username}/likes`);

export const likesAPI = {
  getLikesList,
};

export const LIKES_QUERY_KEYS = {
  LIKES_LIST: 'LIKES_LIST',
};
