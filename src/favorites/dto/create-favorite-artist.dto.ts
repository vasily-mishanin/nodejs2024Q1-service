import { IsNotEmpty } from 'class-validator';

export class CreateFavoriteArtistDto {
  @IsNotEmpty()
  id: string;
}
