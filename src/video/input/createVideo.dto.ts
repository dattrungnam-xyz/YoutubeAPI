import { IsOptional, IsString } from 'class-validator';

export class CreateVideoDTO {
  @IsOptional()
  thumbnailUrl?: string;
  @IsOptional()
  videoUrl?: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
}
