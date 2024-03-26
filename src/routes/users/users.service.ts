import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidUUID, thinObjectOut } from 'src/utils';
import { ReturnedUser } from 'src/types';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new BadRequestException(
        `Invalid data to create user: ${createUserDto}`,
      );
    }
    const creationTime = Date.now();

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        createdAt: creationTime,
        updatedAt: creationTime,
        version: 1,
      },
    });

    let userWithoutPassword = thinObjectOut(user, ['password']) as ReturnedUser;

    userWithoutPassword = {
      ...userWithoutPassword,
      createdAt: Number(userWithoutPassword.createdAt),
      updatedAt: Number(userWithoutPassword.updatedAt),
    };
    return userWithoutPassword;
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { newPassword, oldPassword } = updateUserDto;

    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    if (!newPassword || !oldPassword) {
      throw new BadRequestException('Invalid data to update user');
    }

    if (newPassword === oldPassword) {
      throw new ForbiddenException('New password must be different');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      throw new NotFoundException('Updating user not found');
    }

    if (existingUser.password === updateUserDto.newPassword) {
      throw new ForbiddenException('New password must be different');
    }

    if (existingUser.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Forbidden - wrong old password');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: {
        password: updateUserDto.newPassword,
        updatedAt: Date.now(),
        version: existingUser.version + 1,
      },
    });
    let returnedUser = thinObjectOut(updatedUser, ['password']) as ReturnedUser;

    returnedUser = {
      ...returnedUser,
      createdAt: Number(returnedUser.createdAt),
      updatedAt: Number(returnedUser.updatedAt),
    };

    return returnedUser;
  }

  async remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    try {
      const user = await this.prisma.user.delete({ where: { id: id } });
      return user;
    } catch (error) {
      throw new NotFoundException('Deleting user not found');
    }
  }
}
