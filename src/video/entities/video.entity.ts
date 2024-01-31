import { Column } from 'typeorm';
export class Video {
  id: string;
  idUser: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  description: string;
  createAt: Date;
}
