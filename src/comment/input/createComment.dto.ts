import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
@InputType()
export class CreateCommentDTO {
  @IsOptional()
  @Field({ nullable: true })
  idVideo?: string;

  @IsOptional()
  @Field({ nullable: true })
  idComment?: string;

  @IsString()
  @Field()
  content: string;
}
