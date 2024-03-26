import { IUser } from 'src/types';

export class User implements IUser {
  //@PrimaryGeneratedColumn()
  constructor(
    public id: string, // uuid v4
    public login: string,
    public password: string,
    public version: number, // integer number, increments on update
    public createdAt: number, // timestamp of creation
    public updatedAt: number, // timestamp of last update
  ) {}
}
