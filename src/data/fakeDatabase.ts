import {
  ErrorMessages,
  IAlbum,
  IArtist,
  ICreateAlbumDto,
  ICreateArtistDto,
  ICreateUserDto,
  ITrack,
  IUpdatePasswordDto,
  IUser,
} from 'src/types';
import { v4 as uuidv4 } from 'uuid';

export class FakeDatabase {
  private users: IUser[];
  private artists: IArtist[];
  private albums: IAlbum[];

  constructor() {
    this.users = [];
    this.artists = [];
    this.albums = [];
  }

  //GET

  getUsers() {
    return this.users;
  }

  getArtists() {
    return this.artists;
  }

  getAlbums() {
    return this.albums;
  }

  // GET by Id

  getUserById(id: string) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  getArtistById(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  }

  getAlbumById(id: string) {
    const album = this.albums.find((album) => album.id === id);
    return album;
  }

  // CREATE

  createUser(userDto: ICreateUserDto) {
    const newUser: IUser = {
      ...userDto,
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }

  createArtist(artistDto: ICreateArtistDto) {
    const newArtist: IArtist = {
      ...artistDto,
      id: uuidv4(),
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  createAlbum(albumDto: ICreateAlbumDto) {
    const newAlbum: IAlbum = {
      ...albumDto,
      id: uuidv4(),
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  // UPDATE

  updateUser(id: string, userDto: IUpdatePasswordDto) {
    const existingUserIndex = this.users.findIndex((user) => user.id === id);

    if (existingUserIndex === -1) {
      return null;
    }

    const existingUser = this.users[existingUserIndex];

    if (existingUser.password !== userDto.oldPassword) {
      return ErrorMessages.WRONG_PASSWORD;
    }

    if (existingUser.password === userDto.newPassword) {
      return ErrorMessages.SAME_PASSWORD;
    }

    this.users[existingUserIndex] = {
      ...existingUser,
      password: userDto.newPassword,
      version: existingUser.version + 1,
      updatedAt: Date.now(),
    };

    return this.users[existingUserIndex];
  }

  updateArtist(id: string, artistDto: Partial<ICreateArtistDto>) {
    const existingArtistIndex = this.artists.findIndex(
      (artist) => artist.id === id,
    );

    if (existingArtistIndex === -1) {
      return null;
    }

    this.artists[existingArtistIndex] = {
      ...this.artists[existingArtistIndex],
      ...artistDto,
    };

    return this.artists[existingArtistIndex];
  }

  updateAlbum(id: string, albumDto: Partial<ICreateAlbumDto>) {
    const existingAlbumIndex = this.albums.findIndex(
      (album) => album.id === id,
    );

    if (existingAlbumIndex === -1) {
      return null;
    }

    this.albums[existingAlbumIndex] = {
      ...this.albums[existingAlbumIndex],
      ...albumDto,
    };

    return this.albums[existingAlbumIndex];
  }

  // DELETE
  deleteUser(id: string) {
    const existingUser = this.users.find((user) => user.id === id);

    if (!existingUser) {
      return null;
    }

    this.users = this.users.filter((user) => user.id !== id);
    return existingUser;
  }

  deleteArtist(id: string) {
    const deletingArtist = this.artists.find((artist) => artist.id === id);

    if (!deletingArtist) {
      return null;
    }

    this.artists = this.artists.filter((artist) => artist.id !== id);

    //set album.artistId to null

    const albumsWithArtist = this.albums.filter(
      (album) => album.artistId === deletingArtist.id,
    );

    albumsWithArtist.forEach((albumWithArtist) =>
      this.updateAlbum(albumWithArtist.id, {
        ...albumWithArtist,
        artistId: null,
      }),
    );

    return deletingArtist;
  }

  deleteAlbum(id: string) {
    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      return null;
    }

    this.albums = this.albums.filter((album) => album.id !== id);
    return album;
  }
}
