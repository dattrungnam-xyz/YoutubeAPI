import { PickType } from '@nestjs/mapped-types';
import { CreateCommentDTO } from './createComment.dto';
import { IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class UpdateCommentDTO {
  @IsString()
  @Field()
  content: string;
}
