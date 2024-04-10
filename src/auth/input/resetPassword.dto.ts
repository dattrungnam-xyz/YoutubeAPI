import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './createUser.dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsRepeated } from 'src/validation/IsRepeated.constraint';
import { IsString, Length } from 'class-validator';

@InputType()
export class ResetPassworDTO {
  @Length(6)
  @IsString()
  @Field()
  password: string;

  @IsString()
  @IsRepeated('password')
  @Field()
  passwordConfirm: string;
}
