import { getBaseQuery } from '@shared/api/base-api';
import type { LikesResponse } from '../ts/types';

const BASE_URL = import.meta.env.VITE_API;

const getLikesList = (username: string): Promise<LikesResponse> => getBaseQuery(`${BASE_URL}/users/${username}/likes`);

export const likesAPI = {
  getLikesList,
};

export const LIKES_QUERY_KEYS = {
  LIKES_LIST: 'LIKES_LIST',
};
