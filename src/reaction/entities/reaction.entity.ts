import { Expose, Type } from 'class-transformer';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { Video } from '../../video/entities/video.entity';
import { User } from '../../users/entities/user.entity';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity()
export class Reaction {
  constructor(partial?: Partial<Reaction>) {
    Object.assign(this, partial);
  }
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @ManyToOne(() => User, (user) => user.reactions)
  user: Promise<User>;

  @Expose()
  @Column({
    type: 'enum',
    enum: ReactionType,
    default: ReactionType.LIKE,
  })
  type: ReactionType;

  @Expose()
  @ManyToOne(() => Comment, (comment) => comment.reactions)
  comment?: Promise<Comment>;

  @Expose()
  @ManyToOne(() => Video, (video) => video.reactions)
  video?: Promise<Video>;

  @Expose()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
