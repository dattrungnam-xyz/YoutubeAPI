import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Video {
  constructor(partial?: Partial<Video>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  idUser: string;

  @Column()
  thumbnailUrl: string;

  @Column()
  videoUrl: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  createAt: Date;
}
