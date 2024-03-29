export interface IUser {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export interface IArtist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export interface IAlbum {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

export interface ITrack {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export interface IFavorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

// RETURNED

export type ReturnedUser = Omit<IUser, 'password'>;

// DTO
export interface ICreateUserDto {
  login: string;
  password: string;
}

export interface IUpdatePasswordDto {
  oldPassword: string; // previous password
  newPassword: string; // new password
}

export interface ICreateArtistDto {
  name: string;
  grammy: boolean;
}

export interface ICreateAlbumDto {
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

export interface ICreateTrackDto {
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

//UTILS
export enum ErrorMessages {
  SAME_PASSWORD = 'SAME_PASSWORD',
  WRONG_PASSWORD = 'WRONG_PASSWORD',
}

export interface BigInt {
  toJSON(): string;
}
