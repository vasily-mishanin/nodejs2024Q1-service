import {
  ErrorMessages,
  ICreateUserDto,
  IUpdatePasswordDto,
  IUser,
} from 'src/types';
import { v4 as uuidv4 } from 'uuid';

export class FakeDatabase {
  private users: IUser[];

  constructor() {
    this.users = [];
  }

  getUsers() {
    return this.users;
  }

  createUser(userDto: ICreateUserDto) {
    const newUser: IUser = {
      ...userDto,
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, userDto: IUpdatePasswordDto) {
    const existingUserIndex = this.users.findIndex((user) => user.id === id);

    if (existingUserIndex === -1) {
      return null;
    }

    const existingUser = this.users[existingUserIndex];

    if (existingUser.password !== userDto.oldPassword) {
      return ErrorMessages.WRONG_PASSWORD;
    }

    if (existingUser.password === userDto.newPassword) {
      return ErrorMessages.SAME_PASSWORD;
    }

    this.users[existingUserIndex] = {
      ...existingUser,
      password: userDto.newPassword,
      version: existingUser.version + 1,
      updatedAt: Date.now(),
    };

    return this.users[existingUserIndex];
  }

  getUserById(id: string) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  deleteUser(id: string) {
    const existingUser = this.users.find((user) => user.id === id);

    if (!existingUser) {
      return null;
    }

    if (existingUser) {
      this.users = this.users.filter((user) => user.id !== id);
      return existingUser;
    }
  }
}
