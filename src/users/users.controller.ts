import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { Exception } from 'handlebars';

@Controller('users')
// @SerializeOptions({ strategy: 'excludeAll' })
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
  ): Promise<User> {
    if (!user) throw new UnauthorizedException();
    if (file) {
      updateProfileDTO.avatar = (
        await this.cloudinaryService.uploadImage(file)
      ).url;
    } else {
      delete updateProfileDTO['avatar'];
    }
    return await this.usersService.updateProfile(user, updateProfileDTO);
  }

  @Post('subcribe/:id')
  @UseGuards(JwtAuthGuard)
  async subcribe(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    // if (!user) {
    //   throw new UnauthorizedException('Current user does not exist.');
    // }
    return await this.usersService.subcribe(user, id)
  }

  @Delete('subcribe/:id')
  // @UseGuards(JwtAuthGuard)
  async unsubcribe(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    if (!user) throw new UnauthorizedException('Current user does not exist.');
    return await this.usersService.unsubcribe(user, id);
  }

  @Get(':id')
  async testGetUser(@Param('id') id: string) {
    return await this.usersService.testGetUser(id);
  }
}
