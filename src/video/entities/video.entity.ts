import { Expose } from 'class-transformer';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Reaction } from '../../reaction/entities/reaction.entity';

@Entity()
export class Video {
  constructor(partial?: Partial<Video>) {
    Object.assign(this, partial);
  }
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ nullable: false })
  thumbnailUrl: string;

  @Expose()
  @Column({ nullable: false })
  videoUrl: string;

  @Expose()
  @Column({ nullable: false })
  title: string;

  @Expose()
  @Column()
  description: string;

  @Expose()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createAt: Date;

  @Expose()
  @Column({ default: 0 })
  views: number;

  @Expose()
  @ManyToOne(() => User, (user) => user.videos, { nullable: false })
  user: Promise<User>;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Expose()
  @OneToMany(() => Comment, (comment) => comment.video)
  comments: Promise<Comment[]>;
  
  @Expose()
  @OneToMany(() => Reaction, (reaction) => reaction.video)
  reactions: Promise<Reaction[]>;
}
