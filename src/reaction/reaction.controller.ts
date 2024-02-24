import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { JwtAuthGuard } from 'src/auth/authGuard.jwt';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('like/:id')
  @UseGuards(JwtAuthGuard)
  async likePost(@Param('id') id: string, @CurrentUser() user: User) {}

  @Delete('like/:id')
  @UseGuards(JwtAuthGuard)
  async unlikePost(@Param('id') id: string, @CurrentUser() user: User) {}

  @Post('dislike/:id')
  @UseGuards(JwtAuthGuard)
  async dislikePost(@Param('id') id: string, @CurrentUser() user: User) {}

  @Delete('dislike/:id')
  @UseGuards(JwtAuthGuard)
  async undislikePost(@Param('id') id: string, @CurrentUser() user: User) {}

  
}
