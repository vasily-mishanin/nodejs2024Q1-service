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
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private logger: LoggingService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { login, password } = createUserDto;
      if (!login || !password) {
        this.logger.error(
          `400 - Invalid data to create user: ${createUserDto}`,
        );
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

      let userWithoutPassword = thinObjectOut(user, [
        'password',
      ]) as ReturnedUser;

      userWithoutPassword = {
        ...userWithoutPassword,
        createdAt: Number(userWithoutPassword.createdAt),
        updatedAt: Number(userWithoutPassword.updatedAt),
      };
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      this.logger.error(`500 - Internal Server Error`);
    }
  }

  async findOne(id: string) {
    if (!isValidUUID(id)) {
      this.logger.error(`400 - Invalid user id: ${id}`);
      throw new BadRequestException('Invalid user id');
    }

    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      this.logger.warn(`404 - User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { newPassword, oldPassword } = updateUserDto;

    if (!isValidUUID(id)) {
      this.logger.error(`400 - Invalid user id: ${id}`);
      throw new BadRequestException('Invalid user id');
    }

    if (!newPassword || !oldPassword) {
      this.logger.error(`400 - Invalid data to update user`);
      throw new BadRequestException('Invalid data to update user');
    }

    if (newPassword === oldPassword) {
      this.logger.error(`403 - New password must be different`);
      throw new ForbiddenException('New password must be different');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      this.logger.warn(`404 - Updating user not found`);
      throw new NotFoundException('Updating user not found');
    }

    if (existingUser.password === updateUserDto.newPassword) {
      this.logger.error(`403 - New password must be different`);
      throw new ForbiddenException('New password must be different');
    }

    if (existingUser.password !== updateUserDto.oldPassword) {
      this.logger.error(`403 - Forbidden - wrong old password`);
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
      this.logger.error(`400 - Invalid user id ${id}`);
      throw new BadRequestException('Invalid user id');
    }

    try {
      const user = await this.prisma.user.delete({ where: { id: id } });
      return user;
    } catch (error) {
      this.logger.warn(`404 - Deleting user not found`);
      throw new NotFoundException('Deleting user not found');
    }
  }
}
