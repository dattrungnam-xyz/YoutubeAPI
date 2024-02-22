import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { CreateVideoDTO } from './input/createVideo.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
  ) {}

  async createVideo(user: User, createVideoDTO: CreateVideoDTO) {
    return await this.videoRepository.save(
      new Video({ user: user, ...createVideoDTO }),
    );
  }
}
