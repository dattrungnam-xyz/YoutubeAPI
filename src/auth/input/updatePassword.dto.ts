import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { IsRepeated } from 'src/validation/IsRepeated.constraint';
@InputType()
export class UpdatePasswordDTO {
  @IsString()
  @Field()
  currentPassword: string;

  @IsString()
  @Length(6)
  @Field()
  password: string;

  @IsString()
  @IsRepeated('password')
  @Field()
  passwordConfirm: string;
}
