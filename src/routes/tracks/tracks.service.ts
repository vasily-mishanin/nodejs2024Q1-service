import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { isValidReferenceId, isValidUUID } from 'src/utils';
import { PrismaService } from 'src/prisma.service';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService, private logger: LoggingService) {}

  async create(createTrackDto: CreateTrackDto) {
    const { name, duration, albumId, artistId } = createTrackDto;

    if (
      !name ||
      !duration ||
      !isValidReferenceId(artistId) ||
      !isValidReferenceId(albumId)
    ) {
      this.logger.error('400 - Invalid data to create track');
      throw new BadRequestException('Invalid data to create track');
    }

    const track = await this.prisma.track.create({ data: createTrackDto });
    return track;
  }

  async findAll() {
    try {
      return await this.prisma.track.findMany();
    } catch (error) {
      this.logger.error('500 - Internal Server Error');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async findOne(id: string) {
    if (!isValidUUID(id)) {
      this.logger.error('400 - Invalid track id', id);
      throw new BadRequestException('Invalid track id');
    }

    try {
      const track = await this.prisma.track.findUniqueOrThrow({
        where: { id },
      });
      return track;
    } catch (error) {
      this.logger.warn(`404 - Track with id ${id} not found`);
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const { name, duration, albumId, artistId } = updateTrackDto;

    if (!isValidUUID(id)) {
      this.logger.error('400 - Invalid track id', id);
      throw new BadRequestException('Invalid track id');
    }

    if (
      (!name && !duration && !albumId && !artistId) ||
      !isValidReferenceId(artistId) ||
      !isValidReferenceId(albumId)
    ) {
      this.logger.error('400 - Invalid data to update track', id);
      throw new BadRequestException('Invalid data to update track');
    }

    const existingTrack = await this.prisma.track.findUnique({ where: { id } });
    if (!existingTrack) {
      this.logger.warn(`404 - Track with id ${id} not found`);
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
      this.logger.error(`400 - Invalid track id ${id}`);
      throw new BadRequestException('Invalid track id');
    }

    try {
      const deletedTrack = await this.prisma.track.delete({ where: { id } });
      return deletedTrack;
    } catch (error) {
      this.logger.warn(`404 - Deleting track with ${id} not found`);
      throw new NotFoundException(`Deleting track with ${id} not found`);
    }
  }
}
