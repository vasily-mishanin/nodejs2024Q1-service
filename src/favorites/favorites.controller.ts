import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteTrackDto } from './dto/create-favorite-track.dto';
import { CreateFavoriteAlbumDto } from './dto/create-favorite-album.dto';
import { CreateFavoriteArtistDto } from './dto/create-favorite-artist.dto';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  //POST

  @Post('track/:id')
  createFavTrack(@Body() createFavoriteTrackDto: CreateFavoriteTrackDto) {
    return this.favoritesService.createFavTrack(createFavoriteTrackDto);
  }

  @Post('album/:id')
  createFavAlbum(@Body() createFavoriteAlbumDto: CreateFavoriteAlbumDto) {
    return this.favoritesService.createFavAlbum(createFavoriteAlbumDto);
  }

  @Post('artist/:id')
  createFavArtist(@Body() createFavoriteArtistDto: CreateFavoriteArtistDto) {
    return this.favoritesService.createFavArtist(createFavoriteArtistDto);
  }

  // DELETE

  @Delete('track/:id')
  deleteFavTrack(@Param() id: string) {
    return this.favoritesService.removeFavTrack(id);
  }

  @Delete('album/:id')
  deleteFavAlbum(@Param() id: string) {
    return this.favoritesService.removeFavAlbum(id);
  }

  @Delete('artist/:id')
  deleteFavArtist(@Param() id: string) {
    return this.favoritesService.removeFavArtist(id);
  }
}
