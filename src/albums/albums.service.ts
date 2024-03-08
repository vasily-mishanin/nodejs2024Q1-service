import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { isValidArtistId, isValidUUID } from 'src/utils';
import { db } from 'src/main';

@Injectable()
export class AlbumsService {
  create(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;

    if (!name || !year || !isValidArtistId(artistId)) {
      throw new BadRequestException('Invalid data to create album');
    }
    const album = db.createAlbum(createAlbumDto);
    return album;
  }

  findAll() {
    return db.getAlbums();
  }

  findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const album = db.getAlbumById(id);

    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const { name, year, artistId } = updateAlbumDto;

    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    if ((!name && !year && !artistId) || !isValidArtistId(artistId)) {
      throw new BadRequestException('Invalid data to update album');
    }

    const updatedAlbum = db.updateAlbum(id, updateAlbumDto);

    if (!updatedAlbum) {
      throw new NotFoundException('Updating album not found');
    }

    return updatedAlbum;
  }

  remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const album = db.deleteAlbum(id);

    if (!album) {
      throw new NotFoundException('Deleting album not found');
    }

    return album;
  }
}
