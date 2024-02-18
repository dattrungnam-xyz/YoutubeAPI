import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/authGuard.jwt';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateProfileDTO } from './input/updateProfile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user: User): User {
    return user;
  }

  @Patch('updateProfile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDTO: updateProfileDTO,
  ) {
    if(file)
    {
      
    }
  }
}
