import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';

import { VideoResolver } from './video.resolver';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), CloudinaryModule],
  controllers: [VideoController],
  providers: [VideoService, VideoResolver],
})
export class VideoModule {}
