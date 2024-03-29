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
import { JwtAuthGuard } from 'src/auth/authGuard.jwt';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateReactionDTO } from './input/createReaction.dto';

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
