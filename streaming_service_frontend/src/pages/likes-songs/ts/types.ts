import type { IAlbum, IArtist, ISong } from '@shared/ts/types';

export interface ILikesDto {
  artistLikes: IArtist[];
  albumLikes: IAlbum[];
  songLikes: ISong[];
}
