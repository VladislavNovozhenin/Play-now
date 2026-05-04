import type { RepeatMode, Song } from '@shared/ts/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  currentTrack: Song | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  repeatMode: RepeatMode;
  currentTime: number;
  duration: number;
};
type Action = {
  setCurrentTrack: (track: Song) => void;
  setIsPlaying: (value: boolean) => void;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  playNewTrack: (track: Song, queue: Song[]) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setRepeatMode: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
};
type Store = State & Action;

const initialState: State = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  queue: [],
  repeatMode: 'off',
  currentTime: 0,
  duration: 0,
};

export const playerStore = create<Store>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        setCurrentTrack: (track) =>
          set((state) => {
            state.currentTrack = track;
          }),
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
        playNewTrack: (track, queue) =>
          set((state) => {
            state.currentTrack = track;
            state.isPlaying = true;
            state.queue = queue;
          }),
        nextTrack: () =>
          set((state) => {
            const currentTrackIndex = state.queue.findIndex((i) => i.id === state.currentTrack?.id);
            const nextTrack = state.queue[currentTrackIndex + 1];
            if (!nextTrack) {
              if (state.repeatMode === 'all') {
                state.currentTrack = state.queue[0];
              } else {
                state.isPlaying = false;
              }
            } else {
              state.currentTrack = nextTrack;
            }
          }),
        prevTrack: () =>
          set((state) => {
            const currentTrackIndex = state.queue.findIndex((i) => i.id === state.currentTrack?.id);
            const prevTrack = state.queue[currentTrackIndex - 1];
            if (prevTrack) {
              state.currentTrack = prevTrack;
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
      })),
      {
        name: 'player-storage',
        partialize: (state) => {
          const { isPlaying, ...stateToSave } = state;
          return stateToSave;
        },
      }
    )
  )
);

export const useCurrentTrack = () => playerStore((state) => state.currentTrack);
export const useVolume = () => playerStore((state) => state.volume);
export const useIsPlaying = () => playerStore((state) => state.isPlaying);
export const useQueue = () => playerStore((state) => state.queue);
export const useDuration = () => playerStore((state) => state.duration);
export const useCurrentTime = () => playerStore((state) => state.currentTime);
export const useRepeatMode = () => playerStore((state) => state.repeatMode);

export const setCurrentTrack = (track: Song) => playerStore.getState().setCurrentTrack(track);
export const setVolume = (volume: number) => playerStore.getState().setVolume(volume);
export const setIsPlaying = (value: boolean) => playerStore.getState().setIsPlaying(value);
export const togglePlay = () => playerStore.getState().togglePlay();
export const playNewTrack = (track: Song, queue: Song[]) => playerStore.getState().playNewTrack(track, queue);
export const nextTrack = () => playerStore.getState().nextTrack();
export const prevTrack = () => playerStore.getState().prevTrack();
export const setRepeatMode = () => playerStore.getState().setRepeatMode();
export const setDuration = (duration: number) => playerStore.getState().setDuration(duration);
export const setCurrentTime = (time: number) => playerStore.getState().setCurrentTime(time);
