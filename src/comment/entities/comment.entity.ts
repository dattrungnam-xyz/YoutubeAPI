import { Expose } from 'class-transformer';
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
  @Expose()
  id: string;

  @ManyToOne(() => User, (user) => user.comments)
  @Expose()
  user: Promise<User>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Expose()
  createAt: Date;

  @Column()
  @Expose()
  content: string;

  @ManyToOne(() => Video, (video) => video.comments, { nullable: true })
  @Expose()
  video?: Promise<Video>;

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  @Expose()
  reactions?: Promise<Reaction[]>;

  @OneToMany(() => Comment, (comment) => comment.parentComment, {
    nullable: true,
  })
  @Expose()
  subComment?: Promise<Comment[]>;

  @ManyToOne(() => Comment, (comment) => comment.subComment, { nullable: true })
  @Expose()
  parentComment?: Promise<Comment>;
}
