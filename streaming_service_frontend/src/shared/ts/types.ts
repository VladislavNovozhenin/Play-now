export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  playlists: Playlist[];
  artistLikes: Artist[];
  albumLikes: Album[];
  songLikes: Song[];
}
export interface Album {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  songs: Song[];
  artist: Artist[];
  likes: User;
}

export interface Artist {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  album: Album[];
  likes: User;
}

export interface Playlist {
  id: number;
  name: string;
  createdAt: string;
  user: User;
  songs: Song[];
}

export interface Song {
  id: number;
  name: string;
  filename: string;
  path: string;
  image: string;
  duration: number;
  createdAt: string;
  album: Album;
  artist: Artist;
  playlists: Playlist[];
  likes: User[];
}

export interface ApiError {
  statusCode: number;
  message: string;
}

export interface BaseApiError extends ApiError {
  error: string;
}

export type ModalState = 'add' | 'remove' | 'createPlaylist' | null;

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  access_token: string;
}

export interface LikesResponse {
  artistLikes: Artist[];
  albumLikes: Album[];
  songLikes: Song[];
}
