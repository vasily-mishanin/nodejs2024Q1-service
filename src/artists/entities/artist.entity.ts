import { IArtist } from 'src/types';

export class Artist implements IArtist {
  constructor(
    public id: string, // uuid v4
    public name: string,
    public grammy: boolean,
  ) {}
}
