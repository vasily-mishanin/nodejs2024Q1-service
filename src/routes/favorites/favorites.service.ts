import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { isValidUUID } from 'src/utils';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async createUserIfNotExists() {
    // we have no auth yet so lets create a user to add favorites to
    // TODO - implement auth and current user
    let existingUser = await this.prisma.user.findFirst({
      where: { login: 'TEST_USER_FAV' },
    });

    if (!existingUser) {
      const creationTime = Date.now();
      existingUser = await this.prisma.user.create({
        data: {
          login: 'TEST_USER_FAV',
          password: 'TEST_PASSWORD',
          createdAt: creationTime,
          updatedAt: creationTime,
          version: 1,
        },
      });
    }

    return existingUser;
  }

  // helper
  // TODO - remove after adding auth
  async getFavoriteRecordOrCreateOne() {
    // Check if a Favorites record already exists
    let favorites = await this.prisma.favorites.findFirst();

    if (!favorites) {
      // If no Favorites record exists, create a new one
      favorites = await this.prisma.favorites.create({
        data: {},
      });
    }

    return favorites;
  }

  async findAll() {
    const favorites = await this.prisma.favorites.findMany({
      include: {
        artists: true,
        albums: true,
        tracks: true,
      },
    });

    // console.log('----FAVS----->', favorites);
    if (!favorites.length) {
      return {
        artists: [],
        albums: [],
        tracks: [],
      };
    }

    return favorites[0];
  }

  // ADD TO FAVORITES
  async addFavTrack(trackId: string) {
    if (!isValidUUID(trackId)) {
      throw new BadRequestException('Invalid id');
    }

    try {
      await this.prisma.track.findFirstOrThrow({
        where: { id: trackId },
      });
    } catch (error) {
      throw new UnprocessableEntityException(
        `No track with id ${trackId} found`,
      );
    }

    const favorites = await this.getFavoriteRecordOrCreateOne();

    try {
      const newFavorite = await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          tracks: { connect: { id: trackId } },
        },
      });

      return newFavorite;
    } catch (error) {
      throw new UnprocessableEntityException(
        `Can not add Track with id ${trackId} to favorites`,
      );
    }
  }

  async addFavAlbum(albumId: string) {
    if (!isValidUUID(albumId)) {
      throw new BadRequestException('Invalid album id');
    }

    try {
      await this.prisma.album.findFirstOrThrow({
        where: { id: albumId },
      });
    } catch (error) {
      throw new UnprocessableEntityException(
        `No album with id ${albumId} found`,
      );
    }

    const favorites = await this.getFavoriteRecordOrCreateOne();

    try {
      const newFavorite = await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          albums: { connect: { id: albumId } },
        },
      });

      return newFavorite;
    } catch (error) {
      throw new UnprocessableEntityException(
        `Can not add Album with id ${albumId} to favorites`,
      );
    }
  }

  async addFavArtist(artistId: string) {
    if (!isValidUUID(artistId)) {
      throw new BadRequestException('Invalid id');
    }

    try {
      await this.prisma.artist.findFirstOrThrow({
        where: { id: artistId },
      });
    } catch (error) {
      throw new UnprocessableEntityException(
        `No artist with id ${artistId} found`,
      );
    }

    const favorites = await this.getFavoriteRecordOrCreateOne();

    try {
      const newFavorite = await this.prisma.favorites.update({
        where: { id: favorites.id },
        data: {
          artists: { connect: { id: artistId } },
        },
      });

      return newFavorite;
    } catch (error) {
      throw new UnprocessableEntityException(
        `Can not add Artist with id ${artistId} to favorites`,
      );
    }
  }

  // REMOVE FROM FAVORITES
  async removeFavTrack(trackId: string) {
    if (!isValidUUID(trackId)) {
      throw new BadRequestException('Invalid track id');
    }

    // Check if the favorite exists for the user and track
    const favorites = await this.prisma.favorites.findFirst({
      where: {
        tracks: { some: { id: trackId } }, // Check if the track ID is in the tracks array
      },
    });

    if (!favorites) {
      throw new NotFoundException(`Track with id ${trackId} not found`);
    }

    // Remove the track from the favorite
    const updatedFavorite = await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        tracks: { disconnect: { id: trackId } }, // Disconnect the track from the favorite
      },
    });

    return updatedFavorite;
  }

  async removeFavAlbum(albumId: string) {
    if (!isValidUUID(albumId)) {
      throw new BadRequestException('Invalid album id');
    }

    // Check if the favorite exists for the user and album
    const favorites = await this.prisma.favorites.findFirst({
      where: {
        albums: { some: { id: albumId } }, // Check if the album ID is in the albums array
      },
    });

    if (!favorites) {
      throw new NotFoundException(`Album with id ${albumId} not found`);
    }

    // Remove the album from the favorite
    const updatedFavorite = await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        albums: { disconnect: { id: albumId } }, // Disconnect the album from the favorite
      },
    });

    return updatedFavorite;
  }

  async removeFavArtist(artistId: string) {
    if (!isValidUUID(artistId)) {
      throw new BadRequestException('Invalid artist id');
    }

    // Check if the favorite exists for the user and artist
    const favorites = await this.prisma.favorites.findFirst({
      where: {
        artists: { some: { id: artistId } }, // Check if the artist ID is in the artists array
      },
    });

    if (!favorites) {
      throw new NotFoundException(`Artist with id ${artistId} not found`);
    }

    // Remove the artist from the favorites
    const updatedFavorite = await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        artists: { disconnect: { id: artistId } }, // Disconnect the album from the favorites
      },
    });

    return updatedFavorite;
  }
}
