import { IsEmail, Length } from 'class-validator';
import { UserDoesNotExist } from '../../validation/UserDoesNotExist.constraint';
import { IsRepeated } from '../../validation/IsRepeated.constraint';

export class CreateUserDTO {
  @Length(6)
  @UserDoesNotExist()
  username: string;

  name: string;

  @IsEmail()
  @UserDoesNotExist()
  email: string;

  @Length(6)
  password: string;

  @IsRepeated('password')
  passwordConfirm: string;
}
