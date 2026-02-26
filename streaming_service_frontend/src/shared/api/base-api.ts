import { ACCESS_TOKEN, HTTP_METHODS, HTTP_STATUS } from '@shared/common/constants';
import { getValueFromLocalStorage } from '@shared/common/helpers';

const getRequestHeaders = () => {
  const access_token = getValueFromLocalStorage();
  return {
    'Content-type': 'application/json',
    Authorization: `Bearer ${access_token}`,
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

export const postBaseQuery = async (url: string, body: any) => {
  try {
    const response = await fetch(url, {
      headers: getRequestHeaders(),
      method: HTTP_METHODS.POST,
      body: body ?? {},
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
