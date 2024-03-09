import { IsNotEmpty } from 'class-validator';

export class CreateFavoriteAlbumDto {
  @IsNotEmpty()
  id: string;
}
