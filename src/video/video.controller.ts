import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  SerializeOptions,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDTO } from './input/createVideo.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/authGuard.jwt';
import { ParseFile } from 'src/validation/ParseFile.pipe';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateVideoDTO } from './input/updateVideo.dto';
import { Video } from './entities/video.entity';

@Controller('video')
@SerializeOptions({ strategy: 'excludeAll' })
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async createVideo(
    @UploadedFiles(ParseFile)
    files: {
      video: Express.Multer.File[];
      thumbnail: Express.Multer.File[];
    },
    @Body() createVideoDTO: CreateVideoDTO,
    @CurrentUser() user: User,
  ): Promise<Video> {
    // console.log(files.video[0].mimetype);
    // console.log(files.thumbnail[0].mimetype);

    if (
      !files.video[0].mimetype.startsWith('video') ||
      !files.thumbnail[0].mimetype.startsWith('image')
    )
      throw new BadRequestException('Invalid file type');

    let cloudRes = await Promise.all([
      this.cloudinaryService.uploadVideoStream(files.video[0]),
      this.cloudinaryService.uploadImage(files.thumbnail[0]),
    ]);
    createVideoDTO.videoUrl = cloudRes[0].url;
    createVideoDTO.thumbnailUrl = cloudRes[1].url;

    return await this.videoService.createVideo(user, createVideoDTO);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateVideo(
    @UploadedFile()
    thumbnail: Express.Multer.File,
    @CurrentUser() user: User,
    @Body() updateVideoDTO: UpdateVideoDTO,
    @Param('id') idVideo: string,
  ): Promise<Video> {
    if (thumbnail) {
      if (!thumbnail.mimetype.startsWith('image'))
        throw new BadRequestException('Invalid file type');
      let { url, type } = await this.cloudinaryService.uploadImage(thumbnail);
      updateVideoDTO.thumbnailUrl = url;
    }
    return await this.videoService.updateVideo(idVideo, user, updateVideoDTO);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteVideo(@CurrentUser() user: User, @Param('id') idVideo: string) {
    return await this.videoService.deleteVideo(idVideo, user);
  }

  @Get()
  async getVideos(@Param('page') page: number, @Param('limit') limit: number) {
    page = page || 1;
    limit = limit || 15;
    return await this.videoService.getAllVideo(+page, +limit);
  }
  @Get(':id')
  async getVideo(@Param('id') id: string) {
    return await this.videoService.getVideo(id);
  }
}
