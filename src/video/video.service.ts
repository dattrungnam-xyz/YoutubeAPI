import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { CreateVideoDTO } from './input/createVideo.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateVideoDTO } from './input/updateVideo.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video) private videoRepository: Repository<Video>,
  ) {}

  async createVideo(
    user: User,
    createVideoDTO: CreateVideoDTO,
  ): Promise<Video> {
    return await this.videoRepository.save(
      new Video({ user: user, ...createVideoDTO }),
    );
  }

  async updateVideo(
    idVideo: string,
    user: User,
    updateVideoDTO: UpdateVideoDTO,
  ): Promise<Video> {
    let video = await this.videoRepository.findOne({
      where: {
        id: idVideo,
      },
      relations: ['user'],
    });
    if (!video) {
      throw new NotFoundException('Video not found.');
    }
    if (video.user.id != user.id) {
      throw new ForbiddenException('User not allowed to edit this video.');
    }

    return await this.videoRepository.save(
      new Video({ ...video, ...updateVideoDTO }),
    );
  }

  async deleteVideo(idVideo: string, user: User) {
    let video = await this.videoRepository.findOne({
      where: {
        id: idVideo,
      },
      relations: ['user'],
    });
    if (!video) {
      throw new NotFoundException('Video not found.');
    }
    if (video.user.id != user.id) {
      throw new ForbiddenException('User not allowed to edit this video.');
    }
    return await this.videoRepository.softDelete(idVideo);
  }

  async getAllVideo(): Promise<Video[]> {
    return await this.videoRepository.find({  });
    // return await this.videoRepository.find({ withDeleted: true });
  }
}
