import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { isValidReferenceId, isValidUUID } from 'src/utils';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;

    if (!name || !year || !isValidReferenceId(artistId)) {
      throw new BadRequestException('Invalid data to create album');
    }
    const album = await this.prisma.album.create({ data: createAlbumDto });
    return album;
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    try {
      const album = await this.prisma.album.findUniqueOrThrow({
        where: { id },
      });
      return album;
    } catch (error) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const { name, year, artistId } = updateAlbumDto;

    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    if ((!name && !year && !artistId) || !isValidReferenceId(artistId)) {
      throw new BadRequestException('Invalid data to update album');
    }

    try {
      await this.prisma.album.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Updating album with id ${id} not found`);
    }

    try {
      const updatedAlbum = await this.prisma.album.update({
        where: { id },
        data: updateAlbumDto,
      });

      return updatedAlbum;
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong when update Album',
        error,
      );
    }
  }

  async remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid album id');
    }

    try {
      const removedAlbum = await this.prisma.album.delete({ where: { id } });
      return removedAlbum;
    } catch (error) {
      throw new NotFoundException(`Deleting album with id ${id} not found`);
    }
  }
}
