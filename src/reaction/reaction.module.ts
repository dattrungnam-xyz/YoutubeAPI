import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Video } from '../video/entities/video.entity';
import { Comment } from '../comment/entities/comment.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Reaction, Video, Comment])],
  controllers: [ReactionController],
  providers: [ReactionService],
})
export class ReactionModule {}
