import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './input/createComment.dto';
import { Comment } from './entities/comment.entity';
import { Video } from 'src/video/entities/video.entity';
import { InvalidInputException } from 'src/exception/customExceptions/InvalidInputException';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}
  async createComment(user: User, createCommentDTO: CreateCommentDTO) {
    let comment = new Comment({ content: createCommentDTO.content });
    comment.user = user;
    if (createCommentDTO.idComment) {
      comment.parentComment = await this.commentRepository.findOneBy({
        id: createCommentDTO.idComment,
      });
    } else if (createCommentDTO.idVideo) {
      comment.video = await this.videoRepository.findOneBy({
        id: createCommentDTO.idVideo,
      });
    } else {
      throw new InvalidInputException();
    }
    return await this.commentRepository.save(comment);
  }
  async getComment(id: string) {
    return await this.commentRepository.find({
      where: { id: id },
      relations: ['user', 'video', 'reactions', 'subComment', 'parentComment'],
    });
  }
}
