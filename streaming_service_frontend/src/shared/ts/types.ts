export interface IUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  playlists: IPlaylist[];
  artistLikes: IArtist[];
  albumLikes: IAlbum[];
  songLikes: ISong[];
}
export interface IAlbum {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  songs: ISong[];
  artist: IArtist[];
  likes: IUser;
}

export interface IArtist {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  album: IAlbum[];
  likes: IUser;
}

export interface IPlaylist {
  id: number;
  name: string;
  createdAt: string;
  user: IUser;
  songs: ISong[];
}

export interface ISong {
  id: number;
  name: string;
  filename: string;
  path: string;
  image: string;
  duration: number;
  createdAt: string;
  album: IAlbum;
  artist: IArtist;
  playlists: IPlaylist[];
  likes: IUser[];
}
