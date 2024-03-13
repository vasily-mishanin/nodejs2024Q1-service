import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { isValidReferenceId, isValidUUID } from 'src/utils';
import { db } from 'src/main';

@Injectable()
export class TracksService {
  create(createTrackDto: CreateTrackDto) {
    const { name, duration, albumId, artistId } = createTrackDto;
    if (
      !name ||
      !duration ||
      !isValidReferenceId(artistId) ||
      !isValidReferenceId(albumId)
    ) {
      throw new BadRequestException('Invalid data to create track');
    }

    const track = db.createTrack(createTrackDto);
    return track;
  }

  findAll() {
    return db.getTracks();
  }

  findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const track = db.getTrackById(id);

    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const { name, duration, albumId, artistId } = updateTrackDto;

    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    if (
      (!name && !duration && !albumId && !artistId) ||
      !isValidReferenceId(artistId) ||
      !isValidReferenceId(albumId)
    ) {
      throw new BadRequestException('Invalid data to update track');
    }

    const updatedTrack = db.updateTrack(id, updateTrackDto);

    if (!updatedTrack) {
      throw new NotFoundException('Updating track not found');
    }

    return updatedTrack;
  }

  remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const track = db.deleteTrack(id);

    if (!track) {
      throw new NotFoundException('Deleting track not found');
    }

    return track;
  }
}
