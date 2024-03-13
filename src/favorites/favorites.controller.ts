import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
//@UseGuards(TokenGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  //POST

  @Post('track/:id')
  createFavTrack(@Param('id') id: string) {
    return this.favoritesService.createFavTrack(id);
  }

  @Post('album/:id')
  createFavAlbum(@Param('id') id: string) {
    return this.favoritesService.createFavAlbum(id);
  }

  @Post('artist/:id')
  createFavArtist(@Param('id') id: string) {
    return this.favoritesService.createFavArtist(id);
  }

  // DELETE

  @Delete('track/:id')
  @HttpCode(204)
  deleteFavTrack(@Param('id') id: string) {
    return this.favoritesService.removeFavTrack(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteFavAlbum(@Param('id') id: string) {
    return this.favoritesService.removeFavAlbum(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteFavArtist(@Param('id') id: string) {
    return this.favoritesService.removeFavArtist(id);
  }
}
