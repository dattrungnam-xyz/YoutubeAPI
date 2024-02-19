import { IsOptional, IsString, Length } from 'class-validator';

export class updateProfileDTO {
  avatar?: string;

  @IsOptional()
  @IsString()
  @Length(6)
  name?: string;
}
