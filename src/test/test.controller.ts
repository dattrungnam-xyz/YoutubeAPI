import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  @Post('img')
  @UseInterceptors(FileInterceptor('file'))
  async uploadIMG(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.cloudinaryService.uploadImage(file);
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.cloudinaryService.uploadVideoStream(file);
  }
}
