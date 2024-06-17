import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';


import { AuthGuardLocal } from './authGuard.local';
import { CreateUserDTO } from './input/createUser.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './authGuard.jwt';

import { ResetPassworDTO } from './input/resetPassword.dto';
import { ForgotPassWordDTO } from './input/forgotPassword.dto';
import { UpdatePasswordDTO } from './input/updatePassword.dto';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../decorator/currentUser.decorator';

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}
  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    // let user = await this.authService.createUser(createUserDTO);
    return {
      token: this.authService.signToken(user),
      user: user,
    };
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // async getMe(@Req() req: any): Promise<User> {
  //   // this.mailService.sendMailResetPassword(req.user, 'testurl');
  //   return req.user;
  // }

  @Post('signup')
  async signup(@Body() createUserDTO: CreateUserDTO) {
    let user = await this.authService.createUser(createUserDTO);
    return {
      token: this.authService.signToken(user),
      user: user,
    };
  }

  @Post('forgotPassword')
  async forgotPassword(
    @Body() forgotPassWordDTO: ForgotPassWordDTO,
    @Req() req: Request,
  ) {
    let host = `${req.protocol}://${req.get('Host')}`;
    return await this.authService.forgotPassword(forgotPassWordDTO.email, host);
  }

  @Patch('resetPassword/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPassworDTO: ResetPassworDTO,
  ) {
    return await this.authService.resetPassword(token, resetPassworDTO);
  }

  @Patch('updatePassword')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async updatePassword(
    @CurrentUser() user: User,
    @Body() updatePasswordDTO: UpdatePasswordDTO,
  ) {
    if (!user) throw new UnauthorizedException();
    return await this.authService.updatePassword(user.id, updatePasswordDTO);
  }
}
