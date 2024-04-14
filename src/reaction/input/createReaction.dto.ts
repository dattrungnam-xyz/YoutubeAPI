import { IsEnum, IsOptional } from 'class-validator';
import { CreateDateColumn } from 'typeorm';
import { ReactionType } from '../entities/reaction.entity';
import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class CreateReactionDTO {
  @IsOptional()
  @Field({ nullable: true })
  idVideo?: string;

  @IsOptional()
  @Field({ nullable: true })
  idComment?: string;

  @IsEnum(ReactionType)
  @Field(() => ReactionType)
  type: ReactionType;

  // @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createAt: Date;
}
