import { IsNotEmpty } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  year: number;

  @IsNotEmpty()
  artistId: string | null; // refers to Artist
}
