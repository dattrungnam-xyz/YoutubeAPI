import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { JwtAuthGuard } from 'src/auth/authGuard.jwt';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateReactionDTO } from './input/createReaction.dto';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}
  // include like dislike & unlike undislike
  @Post('')
  @UseGuards(JwtAuthGuard)
  async reaction(
    @CurrentUser() user: User,
    @Body() createReactionDTO: CreateReactionDTO,
  ) {
    return this.reactionService.reaction(user, createReactionDTO);
  }

  //test route
  @Get()
  async getReaction() {
    return await this.reactionService.findAll();
  }
}
