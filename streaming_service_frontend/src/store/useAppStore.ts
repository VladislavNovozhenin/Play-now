import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  token: string | null;
};

type Action = {
  setToken: (value: string | null) => void;
};

type Store = State & Action;

const initialState: State = {
  token: null,
};

export const useAppStore = create<Store>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,
        setToken: (value) =>
          set((state) => {
            state.token = value;
          }),
      })),
      { name: 'app-storage' }
    )
  )
);

export const useToken = () => useAppStore((state) => state.token);
export const setTokenValue = (value: string | null) => useAppStore.getState().setToken(value);
