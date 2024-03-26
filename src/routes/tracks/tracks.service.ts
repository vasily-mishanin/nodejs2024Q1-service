import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { isValidReferenceId, isValidUUID } from 'src/utils';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    const { name, duration, albumId, artistId } = createTrackDto;

    if (
      !name ||
      !duration ||
      !isValidReferenceId(artistId) ||
      !isValidReferenceId(albumId)
    ) {
      throw new BadRequestException('Invalid data to create track');
    }

    const track = await this.prisma.track.create({ data: createTrackDto });
    return track;
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid track id');
    }

    try {
      const track = await this.prisma.track.findUniqueOrThrow({
        where: { id },
      });
      return track;
    } catch (error) {
      throw new NotFoundException(`Track with id ${id} not found`, error);
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
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

    const existingTrack = await this.prisma.track.findUnique({ where: { id } });
    if (!existingTrack) {
      throw new NotFoundException(`Updating track with id ${id} not found`);
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });
    return updatedTrack;
  }

  async remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    try {
      const deletedTrack = await this.prisma.track.delete({ where: { id } });
      return deletedTrack;
    } catch (error) {
      throw new NotFoundException(`Deleting track with ${id} not found`);
    }
  }
}
