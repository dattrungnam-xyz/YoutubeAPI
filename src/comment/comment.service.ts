import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './input/createComment.dto';
import { Comment } from './entities/comment.entity';
import { Video } from 'src/video/entities/video.entity';
import { InvalidInputException } from 'src/exception/customExceptions/InvalidInputException';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCommentDTO } from './input/updateComment.dto';

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
    comment.user = Promise.resolve(user);
    if (createCommentDTO.idComment) {
      comment.parentComment = Promise.resolve(
        await this.commentRepository.findOneBy({
          id: createCommentDTO.idComment,
        }),
      );
    } else if (createCommentDTO.idVideo) {
      comment.video = Promise.resolve(
        await this.videoRepository.findOneBy({
          id: createCommentDTO.idVideo,
        }),
      );
    } else {
      throw new InvalidInputException();
    }
    return await this.commentRepository.save(comment);
  }
  async updateComment(
    id: string,
    user: User,
    updateCommentDTO: UpdateCommentDTO,
  ) {
    let comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    if (!comment) throw new NotFoundException('Comment not found.');
    if ((await comment.user).id != user.id)
      throw new ForbiddenException(
        "You don't have permission to edit this comment.",
      );

    return await this.commentRepository.save(
      new Comment({ ...comment, ...updateCommentDTO }),
    );
  }
  async getComment(id: string) {
    return await this.commentRepository.findOne({
      where: { id: id },
      relations: ['user', 'video', 'reactions', 'subComment', 'parentComment'],
    });
  }

  async getCommentVideo(id: string) {
    let comments = await this.commentRepository.find({
      relations: ['user', 'video', 'reactions'],
      where: { video: { id } },
    });
    let commentsPromise = comments.map((comment) => {
      return this.loadSubComments(comment);
    });
    comments = await Promise.all(commentsPromise);
    return comments;
  }
  async loadSubComments(comment: Comment) {
    let subComments = await this.commentRepository.find({
      where: { parentComment: { id: comment.id } },
      relations: ['user', 'video', 'reactions', 'subComment'],
    });
    if (subComments.length > 0) {
      let promise = subComments.map((sub) => {
        return this.loadSubComments(sub);
      });
      let sub = await Promise.all(promise);
      comment.subComment = Promise.resolve(sub);
    }
    return comment;
  }
}
