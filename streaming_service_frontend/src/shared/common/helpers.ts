import { ACCESS_TOKEN } from './constants';

export const getValueFromLocalStorage = () => {
  try {
    return localStorage.getItem(ACCESS_TOKEN);
  } catch (error) {
    console.error(error, 'Error reading localStorage');
    return null;
  }
};

export const isNullOrUndefined = (value: any): boolean => value === null || value === undefined;
