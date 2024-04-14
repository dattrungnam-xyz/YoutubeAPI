import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { User } from 'src/users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { Video } from 'src/video/entities/video.entity';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { UseGuards } from '@nestjs/common';
import { GQLJwtAuthGuard } from 'src/auth/authGuardGQL.jwt';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { CreateCommentDTO } from './input/createComment.dto';
import { UpdateCommentDTO } from './input/updateComment.dto';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Comment, { name: 'createComment' })
  @UseGuards(GQLJwtAuthGuard)
  public async createComment(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateCommentDTO, name: 'createCommentInput' })
    input: CreateCommentDTO,
  ): Promise<Comment> {
    return await this.commentService.createComment(user, input);
  }

  @Query(() => Comment, { name: 'getComment' })
  public async getComment(
    @Args('id', {
      type: () => String,
    })
    input: string,
  ): Promise<Comment> {
    return await this.commentService.getComment(input);
  }

  @Query(() => [Comment], { name: 'getAllCommentsVideo' })
  public async getAllCommentsVideo(
    @Args('id', {
      type: () => String,
    })
    id: string,
  ) {
    return await this.commentService.getCommentVideo(id);
  }

  @Mutation(() => Comment, { name: 'updateComment' })
  @UseGuards(GQLJwtAuthGuard)
  public async updateComment(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateCommentDTO, name: 'updateCommentInput' })
    updateCommentDTO: UpdateCommentDTO,
  ) {
    return await this.commentService.updateComment(id, user, updateCommentDTO);
  }

  @ResolveField('user', () => User)
  public async user(@Parent() comment: Comment): Promise<User> {
    return await comment.user;
  }
  @ResolveField('video', () => Video)
  public async video(@Parent() comment: Comment): Promise<Video> {
    return await comment.video;
  }
  @ResolveField('reactions', () => [Reaction])
  public async reactions(@Parent() comment: Comment): Promise<Reaction[]> {
    return await comment.reactions;
  }
  @ResolveField('subComments', () => [Comment])
  public async subComments(@Parent() comment: Comment): Promise<Comment[]> {
    return await comment.subComment;
  }
  @ResolveField('parentComment', () => Comment)
  public async parentComment(@Parent() comment: Comment): Promise<Comment> {
    return comment.parentComment;
  }
}
