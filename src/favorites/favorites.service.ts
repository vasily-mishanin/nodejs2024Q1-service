import { Injectable } from '@nestjs/common';
import { CreateFavoriteTrackDto } from './dto/create-favorite-track.dto';
import { CreateFavoriteAlbumDto } from './dto/create-favorite-album.dto';
import { CreateFavoriteArtistDto } from './dto/create-favorite-artist.dto';

@Injectable()
export class FavoritesService {
  findAll() {
    return `This action returns all favorites`;
  }

  createFavTrack(createFavoriteTrackDto: CreateFavoriteTrackDto) {
    return 'This action adds a new favorite';
  }

  createFavAlbum(createFavoriteAlbumDto: CreateFavoriteAlbumDto) {
    return 'This action adds a new favorite';
  }

  createFavArtist(createFavoriteArtistDto: CreateFavoriteArtistDto) {
    return 'This action adds a new favorite';
  }

  removeFavTrack(id: string) {
    return `This action removes a #${id} favorite`;
  }

  removeFavAlbum(id: string) {
    return `This action removes a #${id} favorite`;
  }

  removeFavArtist(id: string) {
    return `This action removes a #${id} favorite`;
  }
}
