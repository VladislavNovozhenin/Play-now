import { ACCESS_TOKEN, HTTP_METHODS, HTTP_STATUS } from '@shared/common/constants';
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

    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      localStorage.removeItem(ACCESS_TOKEN);
      throw new Error('Unauthorized');
    }

    if (response.status !== HTTP_STATUS.OK) {
      throw new Error('error');
    }

    return await response.json();
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

    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      localStorage.removeItem(ACCESS_TOKEN);
      throw new Error('Unauthorized');
    }

    if (response.status === HTTP_STATUS.NO_CONTENT) {
      return null;
    }

    if (!response.ok) {
      throw new Error('error');
    }

    return await response.json();
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

    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      localStorage.removeItem(ACCESS_TOKEN);
      throw new Error('Unauthorized');
    }

    if (response.status !== HTTP_STATUS.OK) {
      throw new Error('error');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};
