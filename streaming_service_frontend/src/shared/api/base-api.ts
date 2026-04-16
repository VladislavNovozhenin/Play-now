import { HTTP_METHODS } from '@shared/common/constants';
import type { AppError } from '@shared/ts/types';
import { useAppStore } from '@store/useAppStore';

const getRequestHeaders = () => {
  const token = useAppStore.getState().user?.token;
  return {
    'Content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const baseFetch = async (url: string, options: RequestInit) => {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw { type: 'network' } satisfies AppError;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw { type: 'api' } satisfies AppError;
  }

  return data;
};

export const getBaseQuery = (url: string) =>
  baseFetch(url, {
    headers: getRequestHeaders(),
    method: HTTP_METHODS.GET,
  });

export const postBaseQuery = (url: string, body?: any, noAuth: boolean = false) =>
  baseFetch(url, {
    headers: noAuth ? { 'Content-type': 'application/json' } : getRequestHeaders(),
    method: HTTP_METHODS.POST,
    body: JSON.stringify(body ?? {}),
  });

export const deleteBaseQuery = (url: string) =>
  baseFetch(url, {
    headers: getRequestHeaders(),
    method: HTTP_METHODS.DELETE,
  });
