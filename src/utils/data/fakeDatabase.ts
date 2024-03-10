import {
  ErrorMessages,
  IAlbum,
  IArtist,
  ICreateAlbumDto,
  ICreateArtistDto,
  ICreateUserDto,
  ICreateTrackDto,
  ITrack,
  IUpdatePasswordDto,
  IUser,
  IFavorites,
} from 'src/types';
import { v4 as uuidv4 } from 'uuid';

export class FakeDatabase {
  private users: IUser[];
  private artists: IArtist[];
  private albums: IAlbum[];
  private tracks: ITrack[];
  private favorites: IFavorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor() {
    this.users = [];
    this.artists = [];
    this.albums = [];
    this.tracks = [];
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

  getTracks() {
    return this.tracks;
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

  getTrackById(id: string) {
    const track = this.tracks.find((track) => track.id === id);
    return track;
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

  createTrack(teackDto: ICreateTrackDto) {
    const newTrack: ITrack = {
      ...teackDto,
      id: uuidv4(),
    };
    this.tracks.push(newTrack);
    return newTrack;
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

  updateTrack(id: string, trackDto: Partial<ICreateTrackDto>) {
    const existingTrackIndex = this.tracks.findIndex(
      (track) => track.id === id,
    );

    if (existingTrackIndex === -1) {
      return null;
    }

    this.tracks[existingTrackIndex] = {
      ...this.tracks[existingTrackIndex],
      ...trackDto,
    };

    return this.tracks[existingTrackIndex];
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

    //set track.artistId to null after deletion

    const tracksWithArtist = this.tracks.filter(
      (track) => track.artistId === deletingArtist.id,
    );

    tracksWithArtist.forEach((trackWithArtist) =>
      this.updateTrack(trackWithArtist.id, {
        ...trackWithArtist,
        artistId: null,
      }),
    );

    // cleanup favorites
    this.favorites.artists = this.favorites.artists.filter(
      (id) => id !== deletingArtist.id,
    );

    return deletingArtist;
  }

  deleteAlbum(id: string) {
    const deletingAlbum = this.albums.find((album) => album.id === id);

    if (!deletingAlbum) {
      return null;
    }

    this.albums = this.albums.filter((album) => album.id !== id);

    //set track.albumId to null after deletion

    const tracksReferringtoThisAlbum = this.tracks.filter(
      (track) => track.albumId === deletingAlbum.id,
    );

    tracksReferringtoThisAlbum.forEach((track) =>
      this.updateTrack(track.id, {
        ...track,
        albumId: null,
      }),
    );

    // cleanup favorites
    this.favorites.albums = this.favorites.albums.filter(
      (id) => id !== deletingAlbum.id,
    );

    return deletingAlbum;
  }

  deleteTrack(id: string) {
    const deletingTrack = this.tracks.find((track) => track.id === id);

    if (!deletingTrack) {
      return null;
    }

    this.tracks = this.tracks.filter((track) => track.id !== id);

    // cleanup favorites
    this.favorites.tracks = this.favorites.tracks.filter(
      (id) => id !== deletingTrack.id,
    );

    return deletingTrack;
  }

  // FAVORITES
  // Favs - Add
  addFavoriteTrack(id: string) {
    if (
      !this.favorites.tracks.includes(id) &&
      this.tracks.some((track) => track.id === id)
    ) {
      this.favorites.tracks.push(id);
    }
  }

  addFavoriteAlbum(id: string) {
    if (
      !this.favorites.albums.includes(id) &&
      this.albums.some((album) => album.id === id)
    ) {
      this.favorites.albums.push(id);
    }
  }

  addFavoriteArtist(id: string) {
    if (
      !this.favorites.artists.includes(id) &&
      this.artists.some((artist) => artist.id === id)
    ) {
      this.favorites.artists.push(id);
    }
  }

  // Favs - remove
  removeFavoriteTrack(id: string) {
    const favTrackId = this.favorites.tracks.find((trackId) => trackId === id);

    if (!favTrackId) {
      return null;
    }

    if (this.favorites)
      this.favorites.tracks = this.favorites.tracks.filter(
        (trackId) => trackId !== id,
      );

    return favTrackId;
  }

  removeFavoriteAlbum(id: string) {
    const favAlbumId = this.favorites.albums.find((albumId) => albumId === id);

    if (!favAlbumId) {
      return null;
    }

    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );

    return favAlbumId;
  }

  removeFavoriteArtist(id: string) {
    const favArtistId = this.favorites.artists.find(
      (artistId) => artistId === id,
    );

    if (!favArtistId) {
      return null;
    }

    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );

    return favArtistId;
  }

  // Favs - getAll Favs

  getAllFavs() {
    const tracks: ITrack[] = this.favorites.tracks.map((id) =>
      this.getTrackById(id),
    );

    const albums: IAlbum[] = this.favorites.albums.map((id) =>
      this.getAlbumById(id),
    );

    const artists: IArtist[] = this.favorites.artists.map((id) =>
      this.getArtistById(id),
    );

    return {
      artists,
      albums,
      tracks,
    };
  }
}
