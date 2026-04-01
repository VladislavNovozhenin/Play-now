import { postBaseQuery } from '@shared/api/base-api';
import type { JwtResponse, LoginRequest, RegisterRequest } from '../ts/types';

const BASE_URL = import.meta.env.VITE_API;

const register = (payload: RegisterRequest): Promise<JwtResponse> => postBaseQuery(`${BASE_URL}/auth/register`, payload, true);

const login = (payload: LoginRequest): Promise<JwtResponse> => postBaseQuery(`${BASE_URL}/auth/login`, payload, true);

export const authAPI = {
  register,
  login,
};
