import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  user: {
    username: string;
    token: string;
  } | null;
  searchValue: string;
};

type Action = {
  setUser: (value: { username: string; token: string } | null) => void;
  setSearchValue: (value: string) => void;
};

type Store = State & Action;

const initialState: State = {
  user: null,
  searchValue: '',
};

export const useAppStore = create<Store>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,
        setSearchValue: (value) =>
          set((state) => {
            state.searchValue = value;
          }),
        setUser: (value) =>
          set((state) => {
            state.user = value;
          }),
      })),
      { name: 'app-storage' }
    )
  )
);

export const useGetUser = () => useAppStore((state) => state.user);
export const setUserValue = (value: { username: string; token: string } | null) => useAppStore.getState().setUser(value);
export const useGetSearchValue = () => useAppStore((state) => state.searchValue);
export const setSearchValue = (value: string) => useAppStore.getState().setSearchValue(value);
