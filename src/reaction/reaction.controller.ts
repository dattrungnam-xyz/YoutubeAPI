import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';

import { CreateReactionDTO } from './input/createReaction.dto';
import { JwtAuthGuard } from '../auth/authGuard.jwt';
import { CurrentUser } from '../decorator/currentUser.decorator';
import { User } from '../users/entities/user.entity';

@Controller('reaction')
@SerializeOptions({ strategy: 'excludeAll' })
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}
  // include like dislike & unlike undislike
  @Post('')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async reaction(
    @CurrentUser() user: User,
    @Body() createReactionDTO: CreateReactionDTO,
  ) {
    return this.reactionService.reaction(user, createReactionDTO);
  }

  //test route
  @Get()
  // @UseInterceptors(ClassSerializerInterceptor)
  async getReaction() {
    return await this.reactionService.findAll();
  }
}
