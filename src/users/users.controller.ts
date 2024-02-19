import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  SerializeOptions,
  UnauthorizedException,
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
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('users')
@SerializeOptions({ strategy: 'excludeAll' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user: User): User {
    return user;
  }

  @Patch('updateProfile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(ClassSerializerInterceptor)
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDTO: updateProfileDTO,
    @CurrentUser() user: User,
  ) {
    if (!user) throw new UnauthorizedException();
    if (file) {
      updateProfileDTO.avatar = (
        await this.cloudinaryService.uploadImage(file)
      ).url;
    } else {
      delete updateProfileDTO['avatar'];
    }
    // console.log(updateProfileDTO);
    // console.log(file);
    return await this.usersService.updateProfile(user, updateProfileDTO);
  }
}
