import {
  ErrorMessages,
  IArtist,
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

  constructor() {
    this.users = [];
    this.artists = [];
  }

  getUsers() {
    return this.users;
  }

  getArtists() {
    return this.artists;
  }

  getUserById(id: string) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  getArtistById(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    return artist;
  }

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

  deleteUser(id: string) {
    const existingUser = this.users.find((user) => user.id === id);

    if (!existingUser) {
      return null;
    }

    this.users = this.users.filter((user) => user.id !== id);
    return existingUser;
  }

  deleteArtist(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      return null;
    }

    this.artists = this.artists.filter((artist) => artist.id !== id);
    return artist;
  }
}
