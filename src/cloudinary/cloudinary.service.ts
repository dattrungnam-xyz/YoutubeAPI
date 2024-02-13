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
  async uploadImage(file: Express.Multer.File): Promise<CloudinaryOutput> {
    const b64 = Buffer.from(file.buffer).toString('base64');
    let url: string = 'data:' + file.mimetype + ';base64,' + b64;
    let res: CloudinaryResponse = await cloudinary.uploader.upload(url, {
      resource_type: 'auto',
    });
    this.logger.log({ url: res.url, type: 'photo' });
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
    this.logger.log({ url: res.url, type: 'video' });
    return { url: res.url, type: 'video' } as CloudinaryOutput;
  }
}
