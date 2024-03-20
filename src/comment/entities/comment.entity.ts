import { Reaction } from 'src/reaction/entities/reaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  constructor(partial?: Partial<Comment>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: Promise<User>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column()
  content: string;

  @ManyToOne(() => Video, (video) => video.comments, { nullable: true })
  video?: Promise<Video>;

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  reactions?: Promise<Reaction[]>;

  @OneToMany(() => Comment, (comment) => comment.parentComment, {
    nullable: true,
  })
  subComment?: Promise<Comment[]>;

  @ManyToOne(() => Comment, (comment) => comment.subComment, { nullable: true })
  parentComment?: Promise<Comment>;
}
