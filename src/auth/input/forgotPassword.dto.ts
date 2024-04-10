import { IsEmail } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ForgotPassWordDTO {
  @IsEmail()
  @Field()
  email: string;
}
