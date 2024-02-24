import { Reaction } from 'src/reaction/entities/reaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Video, (video) => video.comments, { nullable: true })
  video?: Video;

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  reactions?: Reaction[];

  @ManyToOne(() => Comment, (comment) => comment.parentComment, {
    nullable: true,
  })
  subComment?: Comment[];

  @OneToMany(() => Comment, (comment) => comment.subComment, { nullable: true })
  parentComment?: Comment;
}
