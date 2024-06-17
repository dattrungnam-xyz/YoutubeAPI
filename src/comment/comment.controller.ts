import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';

import { CreateCommentDTO } from './input/createComment.dto';
import { UpdateCommentDTO } from './input/updateComment.dto';
import { JwtAuthGuard } from '../auth/authGuard.jwt';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../decorator/currentUser.decorator';

@Controller('comment')
@SerializeOptions({ strategy: 'excludeAll' })
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async createComment(
    @CurrentUser() user: User,
    @Body() createCommentDTO: CreateCommentDTO,
  ) {
    return await this.commentService.createComment(user, createCommentDTO);
  }
  // test
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getComment(@Param('id') id: string) {
    return await this.commentService.getComment(id);
  }

  @Get('video/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCommentVideo(@Param('id') id: string) {
    return await this.commentService.getCommentVideo(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDTO: UpdateCommentDTO,
    @CurrentUser() user: User,
  ) {
    return await this.commentService.updateComment(id, user, updateCommentDTO);
  }
}
