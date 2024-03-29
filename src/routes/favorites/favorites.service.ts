import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { isValidUUID } from 'src/utils';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService, private logger: LoggingService) {}

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
      this.logger.error('400 - INVALID TRACK ID', trackId);
      throw new BadRequestException('Invalid id');
    }

    try {
      await this.prisma.track.findFirstOrThrow({
        where: { id: trackId },
      });
    } catch (error) {
      this.logger.warn(`422 - No track with id ${trackId} found`);
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
      this.logger.error(
        `422 - Can not add Track with id ${trackId} to favorites`,
      );
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
      this.logger.warn(`No album with id ${albumId} found`);
      throw new UnprocessableEntityException(
        `422 - No album with id ${albumId} found`,
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
      this.logger.error(
        `422 - Can not add Album with id ${albumId} to favorites`,
      );

      throw new UnprocessableEntityException(
        `Can not add Album with id ${albumId} to favorites`,
      );
    }
  }

  async addFavArtist(artistId: string) {
    if (!isValidUUID(artistId)) {
      this.logger.error('400 - Invalid aritst id');
      throw new BadRequestException('Invalid aritst id');
    }

    try {
      await this.prisma.artist.findFirstOrThrow({
        where: { id: artistId },
      });
    } catch (error) {
      this.logger.warn(`422 - No artist with id ${artistId} found`);
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
      this.logger.error(
        `422 - Can not add Artist with id ${artistId} to favorites`,
      );
      throw new UnprocessableEntityException(
        `Can not add Artist with id ${artistId} to favorites`,
      );
    }
  }

  // REMOVE FROM FAVORITES
  async removeFavTrack(trackId: string) {
    if (!isValidUUID(trackId)) {
      this.logger.error('400 - Invalid track id', trackId);
      throw new BadRequestException('Invalid track id');
    }

    // Check if the favorite exists for the user and track
    const favorites = await this.prisma.favorites.findFirst({
      where: {
        tracks: { some: { id: trackId } }, // Check if the track ID is in the tracks array
      },
    });

    if (!favorites) {
      this.logger.warn(`404 - Track with id ${trackId} not found`);
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
      this.logger.error('400 - Invalid album id');
      throw new BadRequestException('Invalid album id');
    }

    // Check if the favorite exists for the user and album
    const favorites = await this.prisma.favorites.findFirst({
      where: {
        albums: { some: { id: albumId } }, // Check if the album ID is in the albums array
      },
    });

    if (!favorites) {
      this.logger.warn(`404 - Album with id ${albumId} not found`);
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
      this.logger.error('400 - Invalid artist id');
      throw new BadRequestException('Invalid artist id');
    }

    // Check if the favorite exists for the user and artist
    const favorites = await this.prisma.favorites.findFirst({
      where: {
        artists: { some: { id: artistId } }, // Check if the artist ID is in the artists array
      },
    });

    if (!favorites) {
      this.logger.warn(`404 - Artist with id ${artistId} not found`);
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
