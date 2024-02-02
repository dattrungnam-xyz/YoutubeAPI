import { Body, Controller, Post } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  async create(@Body() input: any) {
    return await this.videoService.createVideo(input);
  }
}
