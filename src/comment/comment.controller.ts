import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';

import { CreateCommentDTO } from './input/createComment.dto';
import { UpdateCommentDTO } from './input/updateComment.dto';
import { JwtAuthGuard } from '../auth/authGuard.jwt';
import { CurrentUser } from '../decorator/currentUser.decorator';
import { User } from '../users/entities/user.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @CurrentUser() user: User,
    @Body() createCommentDTO: CreateCommentDTO,
  ) {
    return await this.commentService.createComment(user, createCommentDTO);
  }
  // test
  @Get(':id')
  async getComment(@Param('id') id: string) {
    return await this.commentService.getComment(id);
  }

  @Get("video/:id")
  async getCommentVideo(@Param('id') id: string) {
    return await this.commentService.getCommentVideo(id);
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDTO: UpdateCommentDTO,
    @CurrentUser() user: User,
  ) {
    return await this.commentService.updateComment(id, user, updateCommentDTO);
  }
}
