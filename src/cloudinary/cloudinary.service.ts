/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryOutput } from './cloudinary.output';
import { CloudinaryResponse } from './cloudinary-response';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  private logger = new Logger(CloudinaryService.name);
  constructor() {}
  async uploadImageBase64(url: string): Promise<CloudinaryOutput> {
    let res: CloudinaryResponse = await cloudinary.uploader.upload(url, {
      resource_type: 'auto',
    });
    return { url: res.url, type: 'photo' } as CloudinaryOutput;
  }
  async uploadVideoStream(
    file: Express.Multer.File,
  ): Promise<CloudinaryOutput> {
    let res: CloudinaryResponse = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'video' },
          async (error, uploadResult) => {
            return resolve(uploadResult);
          },
        )
        .end(file.buffer);
    });
    return { url: res.url, type: 'video' } as CloudinaryOutput;
  }
}
