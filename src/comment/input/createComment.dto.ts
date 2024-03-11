import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsOptional()
  idVideo?: string;
  
  @IsOptional()
  idComment?: string;

  @IsString()
  content: string;
}
