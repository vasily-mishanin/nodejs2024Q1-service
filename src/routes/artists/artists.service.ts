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
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (!name || !isBoolean(grammy)) {
      throw new BadRequestException('Invalid data to create artist');
    }
    // const artist = db.createArtist(createArtistDto);
    const artist = await this.prisma.artist.create({ data: createArtistDto });
    return artist;
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    try {
      const artist = await this.prisma.artist.findUniqueOrThrow({
        where: { id },
      });
      return artist;
    } catch (error) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    if (
      !isValidUUID(id) ||
      !updateArtistDto.name ||
      !isBoolean(updateArtistDto.grammy)
    ) {
      throw new BadRequestException('Invalid data to update artist');
    }

    const existingArtist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!existingArtist) {
      throw new NotFoundException(`Updating artist with id ${id} not found`);
    }

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });

    return updatedArtist;
  }

  async remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    try {
      const removedArtist = await this.prisma.artist.delete({ where: { id } });
      return removedArtist;
    } catch (error) {
      throw new NotFoundException(`Deleting artist with id ${id} not found`);
    }
  }
}
