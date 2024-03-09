import { IsNotEmpty } from 'class-validator';

export class CreateFavoriteTrackDto {
  @IsNotEmpty()
  id: string;
}
