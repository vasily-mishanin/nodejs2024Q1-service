import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { db } from 'src/main';
import { isValidUUID } from 'src/utils';
import { isBoolean } from 'class-validator';

@Injectable()
export class ArtistsService {
  create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (!name || !isBoolean(grammy)) {
      throw new BadRequestException('Invalid data to create user');
    }
    const artist = db.createArtist(createArtistDto);
    return artist;
  }

  findAll() {
    return db.getUsers();
  }

  findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const artist = db.getArtistById(id);

    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    if (
      !isValidUUID(id) ||
      !updateArtistDto.name ||
      !isBoolean(updateArtistDto.grammy)
    ) {
      throw new BadRequestException('Invalid id');
    }

    const updatedArtist = db.updateArtist(id, updateArtistDto);

    if (!updatedArtist) {
      throw new NotFoundException('Updating artist not found');
    }

    return updatedArtist;
  }

  remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const artist = db.deleteArtist(id);

    if (!artist) {
      throw new NotFoundException('Deleting artist not found');
    }

    return artist;
  }
}
