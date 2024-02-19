import { IsEmail, IsString, Length } from 'class-validator';
import { UserDoesNotExist } from '../../validation/UserDoesNotExist.constraint';
import { IsRepeated } from '../../validation/IsRepeated.constraint';

export class CreateUserDTO {
  @Length(6)
  @IsString()
  @UserDoesNotExist()
  username: string;

  @IsString()
  @Length(6)
  name: string;

  @IsEmail()
  @UserDoesNotExist()
  email: string;

  @Length(6)
  @IsString()
  password: string;

  @IsString()
  @IsRepeated('password')
  passwordConfirm: string;
}
