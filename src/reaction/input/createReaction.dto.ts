import { IsEnum, IsOptional } from 'class-validator';
import { CreateDateColumn } from 'typeorm';
import { ReactionType } from '../entities/reaction.entity';

export class CreateReactionDTO {
  @IsOptional()
  idVideo?: string;

  @IsOptional()
  idComment?: string;

  @IsEnum(ReactionType)
  type: ReactionType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
