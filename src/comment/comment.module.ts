import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/video/entities/video.entity';
import { Comment } from './entities/comment.entity';
import { CommentResolver } from './comment.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Video])],
  controllers: [CommentController],
  providers: [CommentService,CommentResolver],
})
export class CommentModule {}
