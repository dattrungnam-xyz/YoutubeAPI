import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDTO } from './createVideo.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateVideoDTO extends PartialType(CreateVideoDTO) {
  @IsOptional()
  @IsNumber()
  view?: number;
}
