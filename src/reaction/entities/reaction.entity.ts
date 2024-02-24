import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import {
  Column,
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reactions)
  user: User;

  @Column({
    type: 'enum',
    enum: ReactionType,
    default: ReactionType.LIKE,
  })
  type: ReactionType;

  @ManyToOne(() => Comment, (comment) => comment.reactions)
  comment?: Comment;

  @ManyToOne(() => Video, (video) => video.reactions)
  video?: Video;
}
