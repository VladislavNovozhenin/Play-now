import dayjs from '@shared/lib/dayjs';
import { DEFAULT_DATE_FORMAT, SERVER_DATE_FORMAT } from './constants';
import type { Playlist, User } from '@shared/ts/types';
export const isNullOrUndefined = (value: unknown): value is null | undefined => value == null;

export const isIterableArray = (value: any): boolean => Array.isArray(value) && !!value.length;
export const formatDate = (date: string) => {
  const parsed = dayjs(date, SERVER_DATE_FORMAT);
  if (dayjs().diff(parsed, 'day') < 7) {
    return parsed.fromNow();
  }
  return parsed.format(DEFAULT_DATE_FORMAT);
};

export const formatMilliSecondsToMS = (ms: number) => {
  const m = 60000;
  const s = 1000;

  const minutes = Math.floor(ms / m);
  const seconds = Math.round((ms % m) / s);

  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${minutes}:${paddedSeconds}`;
};

export const findTrackInPlaylists = (playlists: Playlist[], trackId: number) => {

  const playlistsWithTrack: Playlist[] = [];
  const playlistsWithoutTrack: Playlist[] = [];
  for (let playlist of playlists) {
    const isFind = playlist.songs.some((track) => track.id === trackId);
    if (isFind) {
      playlistsWithTrack.push(playlist);
    } else {
      playlistsWithoutTrack.push(playlist);
    }
  }
  return {
    playlistsWithTrack,
    playlistsWithoutTrack,
    findLength: playlistsWithTrack.length,
  };
};

export const getLikeTracksByUsername = (likeTracks: User[], username: string) => likeTracks.filter((track) => track.username === username);
