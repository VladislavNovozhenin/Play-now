import type { PageQueue, RepeatMode, Song } from '@shared/ts/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import shuffle from 'lodash/shuffle';

type State = {
  currentId: number | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  originalQueue: Song[];
  repeatMode: RepeatMode;
  currentTime: number;
  duration: number;
  isShuffled: boolean;
  source: { type: PageQueue; id?: string };
  isInitialized: boolean;
};
type Action = {
  setIsPlaying: (value: boolean) => void;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  playNewTrack: (id: number, queue: Song[], source: { type: PageQueue; id?: string }) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setRepeatMode: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setShuffleQueue: () => void;
  setUnshuffleQueue: () => void;
  initPlayer: (queue: Song[]) => void;
  setSource: (source: { type: PageQueue; id?: string }) => void;
};
type Store = State & Action;

const initialState: State = {
  currentId: null,
  isPlaying: false,
  volume: 0.7,
  queue: [],
  originalQueue: [],
  repeatMode: 'off',
  currentTime: 0,
  duration: 0,
  isShuffled: false,
  source: { type: null },
  isInitialized: false,
};

export const playerStore = create<Store>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,
        setIsPlaying: (value) =>
          set((state) => {
            state.isPlaying = value;
          }),
        setVolume: (volume) =>
          set((state) => {
            state.volume = volume;
          }),
        togglePlay: () =>
          set((state) => {
            state.isPlaying = !state.isPlaying;
          }),
        playNewTrack: (id, queue, source) =>
          set((state) => {
            state.currentId = id;
            state.isPlaying = true;
            state.queue = queue;
            state.currentTime = 0;
            state.isShuffled = false;
            state.originalQueue = [];
            state.source = source;
          }),
        nextTrack: () =>
          set((state) => {
            const index = state.queue.findIndex((i) => i.id === state.currentId);
            if (index === state.queue.length - 1) {
              if (state.repeatMode === 'all') {
                state.currentId = state.queue[0].id;
              } else {
                state.isPlaying = false;
              }
            } else {
              const nextIndex = index + 1;
              state.currentId = state.queue[nextIndex].id;
            }
          }),
        prevTrack: () =>
          set((state) => {
            const index = state.queue.findIndex((i) => i.id === state.currentId);
            if (index > 0) {
              const prevIndex = index - 1;
              state.currentId = state.queue[prevIndex].id;
            }
          }),
        setRepeatMode: () =>
          set((state) => {
            if (state.repeatMode === 'off') {
              state.repeatMode = 'one';
            } else if (state.repeatMode === 'one') {
              state.repeatMode = 'all';
            } else {
              state.repeatMode = 'off';
            }
          }),
        setCurrentTime: (time) =>
          set((state) => {
            state.currentTime = time;
          }),
        setDuration: (duration) =>
          set((state) => {
            state.duration = duration;
          }),
        setShuffleQueue: () =>
          set((state) => {
            if (!state.queue.length || state.isShuffled) return;
            const currentTrack = state.queue.find((i) => i.id === state.currentId);
            state.originalQueue = [...state.queue];
            state.isShuffled = true;
            const shuffled = shuffle(state.queue);

            if (currentTrack) {
              const filtered = shuffled.filter((i) => i.id !== currentTrack.id);
              state.queue = [currentTrack, ...filtered];
            } else {
              state.queue = shuffled;
            }
          }),
        setUnshuffleQueue: () =>
          set((state) => {
            state.isShuffled = false;
            state.queue = [...state.originalQueue];
            state.originalQueue = [];
          }),
        initPlayer: (queue) =>
          set((state) => {
            if (state.isInitialized) return;
            state.queue = queue;
            state.isInitialized = true;
          }),
        setSource: (source) =>
          set((state) => {
            state.source = source;
          }),
      })),
      {
        name: 'player-storage',
        partialize: (state) => {
          const { volume, currentId, source, ...rest } = state;
          return { volume, currentId, source };
        },
      }
    )
  )
);

export const useCurrentTrack = () => playerStore((state) => state.queue.find((i) => i.id === state.currentId) ?? null);
export const useVolume = () => playerStore((state) => state.volume);
export const useIsPlaying = () => playerStore((state) => state.isPlaying);
export const useQueue = () => playerStore((state) => state.queue);
export const useDuration = () => playerStore((state) => state.duration);
export const useCurrentTime = () => playerStore((state) => state.currentTime);
export const useRepeatMode = () => playerStore((state) => state.repeatMode);
export const useIsShuffled = () => playerStore((state) => state.isShuffled);
export const useSource = () => playerStore((state) => state.source);

export const setVolume = (volume: number) => playerStore.getState().setVolume(volume);
export const setIsPlaying = (value: boolean) => playerStore.getState().setIsPlaying(value);
export const togglePlay = () => playerStore.getState().togglePlay();
export const playNewTrack = (id: number, queue: Song[], source: { type: PageQueue; id?: string }) =>
  playerStore.getState().playNewTrack(id, queue, source);
export const nextTrack = () => playerStore.getState().nextTrack();
export const prevTrack = () => playerStore.getState().prevTrack();
export const setRepeatMode = () => playerStore.getState().setRepeatMode();
export const setDuration = (duration: number) => playerStore.getState().setDuration(duration);
export const setCurrentTime = (time: number) => playerStore.getState().setCurrentTime(time);
export const setShuffleQueue = () => playerStore.getState().setShuffleQueue();
export const setUnshuffleQueue = () => playerStore.getState().setUnshuffleQueue();
export const initPlayer = (queue: Song[]) => playerStore.getState().initPlayer(queue);
export const setSource = (source: { type: PageQueue; id?: string }) => playerStore.getState().setSource(source);
