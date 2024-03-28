import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './routes/users/users.module';
import { TracksModule } from './routes/tracks/tracks.module';
import { ArtistsModule } from './routes/artists/artists.module';
import { AlbumsModule } from './routes/albums/albums.module';
import { FavoritesModule } from './routes/favorites/favorites.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
