import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ReactionService } from './reaction.service';
import { User } from 'src/users/entities/user.entity';
import { Reaction } from './entities/reaction.entity';
import { Video } from 'src/video/entities/video.entity';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { GQLJwtAuthGuard } from 'src/auth/authGuardGQL.jwt';
import { UseGuards } from '@nestjs/common';
import { CreateReactionDTO } from './input/createReaction.dto';

@Resolver(()=>Reaction)
export class ReactionResolver {
  constructor(private readonly reactionService: ReactionService) {}

  @Mutation(() => Reaction, { name: 'createReaction' })
  @UseGuards(GQLJwtAuthGuard)
  public async reaction(
    @CurrentUser() user: User,
    @Args('input', {
      type: () => CreateReactionDTO,
      name: 'createReactionInput',
    })
    input: CreateReactionDTO,
  ) {
    return await this.reactionService.reaction(user, input);
  }

  @ResolveField('user', () => User)
  public async user(@Parent() reaction: Reaction) {
    return await reaction.user;
  }
  @ResolveField('comment', () => Comment)
  public async comment(@Parent() reaction: Reaction) {
    return await reaction.comment;
  }
  @ResolveField('video', () => Video)
  public async video(@Parent() reaction: Reaction) {
    return await reaction.video;
  }
}
