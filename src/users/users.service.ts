import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FakeDatabase } from 'src/data/fakeDatabase';
import { isValidUUID } from 'src/utils';
import { ErrorMessages } from 'src/types';

const db = new FakeDatabase();

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new BadRequestException('Invalid data to create user');
    }
    const { password: pswd, ...user } = db.createUser(createUserDto);
    return user;
  }

  findAll() {
    return db.getUsers();
  }

  findOne(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const user = db.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
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

    const dbResponse = db.updateUser(id, updateUserDto);

    if (!dbResponse) {
      throw new NotFoundException('Updating user not found');
    }

    if (dbResponse === ErrorMessages.SAME_PASSWORD) {
      throw new ForbiddenException('New password must be different');
    }
    if (dbResponse === ErrorMessages.WRONG_PASSWORD) {
      throw new ForbiddenException('Forbidden - wrong old password');
    }

    const { password: pswd, ...user } = dbResponse;
    return user;
  }

  remove(id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid id');
    }

    const user = db.deleteUser(id);

    if (!user) {
      throw new NotFoundException('Deleting user not found');
    }

    return user;
  }
}
