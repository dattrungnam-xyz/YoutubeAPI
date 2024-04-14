import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Repository } from 'typeorm';
import { CreateReactionDTO } from './input/createReaction.dto';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}
  async reaction(user: User, createReactionDTO: CreateReactionDTO) {
    if (createReactionDTO.idComment) {
      let reaction = await this.reactionRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
          comment: {
            id: createReactionDTO.idComment,
          },
        },
        relations: ['user', 'comment'],
      });
      if (reaction) {
        await this.reactionRepository.delete(reaction.id);
        return new Reaction();

      } else {
        let comment = await this.commentRepository.findOneBy({
          id: createReactionDTO.idComment,
        });
        return await this.reactionRepository.save(
          new Reaction({
            user: Promise.resolve(user),
            comment: Promise.resolve(comment),
            type: createReactionDTO.type,
          }),
        );
      }
    }
    if (createReactionDTO.idVideo) {
      let reaction = await this.reactionRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
          video: {
            id: createReactionDTO.idVideo,
          },
        },
        relations: ['user', 'video'],
      });
      if (reaction) {
        await this.reactionRepository.delete(reaction.id);
        return new Reaction();
      } else {
        let video = await this.videoRepository.findOneBy({
          id: createReactionDTO.idVideo,
        });
        return await this.reactionRepository.save(
          new Reaction({
            user: Promise.resolve(user),
            video: Promise.resolve(video),
            type: createReactionDTO.type,
          }),
        );
      }
    }
  }
  async findAll() {
    return await this.videoRepository.find({
      relations: ['user', 'video', 'comment'],
    });
  }
}
