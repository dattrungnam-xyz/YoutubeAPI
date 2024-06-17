import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TestService } from './test.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFile } from '../validation/ParseFile.pipe';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


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
    @UploadedFile(
      ParseFile,
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.cloudinaryService.uploadImage(file);
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @Body() body: any,
    @UploadedFile(
      ParseFile,
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'video' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.cloudinaryService.uploadVideoStream(file);
  }
}
