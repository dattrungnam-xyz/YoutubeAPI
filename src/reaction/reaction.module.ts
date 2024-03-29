import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Video } from 'src/video/entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction, Video, Comment])],
  controllers: [ReactionController],
  providers: [ReactionService],
})
export class ReactionModule {}
