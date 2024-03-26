import { IsNotEmpty } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  artistId: string | null; // refers to Artist
  @IsNotEmpty()
  albumId: string | null; // refers to Album
  @IsNotEmpty()
  duration: number; // integer number
}
