import { getBaseQuery, postBaseQuery } from '@shared/api/base-api';
import type { LoginDto, RegisterDto } from '../ts/types';

const BASE_URL = import.meta.env.VITE_API;

const register = (payload: RegisterDto) => postBaseQuery(`${BASE_URL}/auth/register`, payload, true);

const login = (payload: LoginDto) => postBaseQuery(`${BASE_URL}/auth/login`, payload, true);

const getProfile = () => getBaseQuery(`${BASE_URL}/users`)

export const authAPI = {
  register,
  login,
  getProfile
};
