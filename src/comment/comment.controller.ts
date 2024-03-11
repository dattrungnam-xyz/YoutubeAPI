import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/authGuard.jwt';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateCommentDTO } from './input/createComment.dto';

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

  @Get(':id')
  async getComment(@Param('id') id: string) {
    return await this.commentService.getComment(id);
  }
}
