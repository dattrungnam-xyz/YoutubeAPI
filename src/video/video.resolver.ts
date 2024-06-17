import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VideoService } from './video.service';
import { Video } from './entities/video.entity';
import { FileUpload } from './input/fileUpload';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Resolver(() => Video)
export class VideoResolver {
  constructor(private readonly videoService: VideoService) {}

  @Mutation(() => Video, { name: 'createVideo' })
  public async createVideo(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
  ) {
    console.log(file);
    return new Video();
  }
}
