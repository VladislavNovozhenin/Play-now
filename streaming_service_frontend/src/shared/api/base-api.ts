import { HTTP_METHODS, } from '@shared/common/constants';
import { useAppStore } from '@store/useAppStore';

const getRequestHeaders = () => {
  const token = useAppStore.getState().user?.token;
  return {
    'Content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const getBaseQuery = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: getRequestHeaders(),
      method: HTTP_METHODS.GET,
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const postBaseQuery = async (url: string, body?: any, noAuth: boolean = false) => {
  try {
    const response = await fetch(url, {
      headers: noAuth ? { 'Content-type': 'application/json' } : getRequestHeaders(),
      method: HTTP_METHODS.POST,
      body: JSON.stringify(body ?? {}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteBaseQuery = async (url: string) => {
  try {
    const response = await fetch(url, {
      headers: getRequestHeaders(),
      method: HTTP_METHODS.DELETE,
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    throw error;
  }
};
