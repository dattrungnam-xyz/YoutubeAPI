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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuardLocal } from './authGuard.local';
import { CreateUserDTO } from './input/createUser.dto';
import { get } from 'http';
import { JwtAuthGuard } from './authGuard.jwt';

@Controller('auth')
// @SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return user;
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // async getMe(@Req() req:any): Promise<User> {
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
}
