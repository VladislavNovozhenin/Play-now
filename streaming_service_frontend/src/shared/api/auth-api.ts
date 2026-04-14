import { postBaseQuery } from '@shared/api/base-api';
import type { RegisterRequest, JwtResponse, LoginRequest } from '@shared/ts/types';

const BASE_URL = import.meta.env.VITE_API;

const register = (payload: RegisterRequest): Promise<JwtResponse> => postBaseQuery(`${BASE_URL}/auth/register`, payload, true);

const login = (payload: LoginRequest): Promise<JwtResponse> => postBaseQuery(`${BASE_URL}/auth/login`, payload, true);

export const authAPI = {
  register,
  login,
};
