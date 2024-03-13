import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { db } from 'src/main';
import { isValidUUID } from 'src/utils';

@Injectable()
export class FavoritesService {
  findAll() {
    return db.getAllFavs();
  }

  createFavTrack(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const track = db.getTrackById(id);

    if (!track) {
      throw new UnprocessableEntityException(`No track with id ${id} found`);
    }

    db.addFavoriteTrack(id);
  }

  createFavAlbum(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const album = db.getAlbumById(id);

    if (!album) {
      throw new UnprocessableEntityException(`No album with id ${id} found`);
    }

    db.addFavoriteAlbum(id);
  }

  createFavArtist(id: string) {
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

  removeFavTrack(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const deletedTrackId = db.removeFavoriteTrack(id);

    if (!deletedTrackId) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  removeFavAlbum(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const deletedAlbumId = db.removeFavoriteAlbum(id);

    if (!deletedAlbumId) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }

  removeFavArtist(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const deletedArtistId = db.removeFavoriteArtist(id);

    if (!deletedArtistId) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
