import { IsEmail } from 'class-validator';

export class ForgotPassWordDTO {
  @IsEmail()
  email: string;
}
