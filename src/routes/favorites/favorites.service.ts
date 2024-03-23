import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { db } from 'src/main';
import { PrismaService } from 'src/prisma.service';
import { isValidUUID } from 'src/utils';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const favorites = await this.prisma.favorites.findMany({
      include: {
        artists: true,
        albums: true,
        tracks: true,
      },
    });

    console.log('----FAVS-----', favorites);
    if (!favorites.length) {
      return {
        artists: [],
        albums: [],
        tracks: [],
      };
    }

    return favorites;
  }

  async createFavTrack(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const track = db.getTrackById(id);

    if (!track) {
      throw new UnprocessableEntityException(`No track with id ${id} found`);
    }

    db.addFavoriteTrack(id);
  }

  async createFavAlbum(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const album = db.getAlbumById(id);

    if (!album) {
      throw new UnprocessableEntityException(`No album with id ${id} found`);
    }

    db.addFavoriteAlbum(id);
  }

  async createFavArtist(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const artist = db.getArtistById(id);

    if (!artist) {
      throw new UnprocessableEntityException(`No album with id ${id} found`);
    }

    db.addFavoriteArtist(id);
  }

  // REMOVE

  async removeFavTrack(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const deletedTrackId = db.removeFavoriteTrack(id);

    if (!deletedTrackId) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  async removeFavAlbum(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const deletedAlbumId = db.removeFavoriteAlbum(id);

    if (!deletedAlbumId) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }

  async removeFavArtist(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const deletedArtistId = db.removeFavoriteArtist(id);

    if (!deletedArtistId) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
