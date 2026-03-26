
import { setTokenValue } from '@store/useAppStore';
import type { LoginDto, LoginResponse, RegisterDto } from './ts/types';
import { authAPI } from './api/api';


export const loginUser = async (value: LoginDto) => {
  const response: LoginResponse = await authAPI.login(value);
  setTokenValue(response.access_token);
};

export const registerUser = async (value: RegisterDto) => {
  const response: LoginResponse = await authAPI.register(value);
  setTokenValue(response.access_token);
};
