import { IsEmail, IsString, Length } from 'class-validator';
import { UserDoesNotExist } from '../../validation/UserDoesNotExist.constraint';
import { IsRepeated } from '../../validation/IsRepeated.constraint';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDTO {
  @Length(6)
  @IsString()
  @UserDoesNotExist()
  @Field()
  username: string;

  @IsString()
  @Length(6)
  @Field()
  name: string;

  @IsEmail()
  @UserDoesNotExist()
  @Field()
  email: string;

  @Length(6)
  @IsString()
  @Field()
  password: string;

  @IsString()
  @IsRepeated('password')
  @Field()
  passwordConfirm: string;
}
