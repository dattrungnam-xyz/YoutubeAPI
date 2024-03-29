import { Expose, Type } from 'class-transformer';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
