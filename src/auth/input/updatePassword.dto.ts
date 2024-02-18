import { IsString, Length } from 'class-validator';
import { IsRepeated } from 'src/validation/IsRepeated.constraint';

export class UpdatePasswordDTO {
  @IsString()
  currentPassword: string;

  @IsString()
  @Length(6)
  password: string;
  
  @IsString()
  @IsRepeated('password')
  passwordConfirm: string;
}
