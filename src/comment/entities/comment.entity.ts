import { Field, ObjectType } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Video } from '../../video/entities/video.entity';
import { Reaction } from '../../reaction/entities/reaction.entity';

@ObjectType()
@Entity()
export class Comment {
  constructor(partial?: Partial<Comment>) {
    Object.assign(this, partial);
  }
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.comments)
  @Field(() => User, { nullable: false })
  user: Promise<User>;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  createAt: Date;

  @Column()
  @Field()
  content: string;

  @ManyToOne(() => Video, (video) => video.comments, { nullable: true })
  @Field(() => Video, { nullable: true })
  video?: Promise<Video>;

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  @Field(() => [Reaction], { nullable: true })
  reactions?: Promise<Reaction[]>;

  @OneToMany(() => Comment, (comment) => comment.parentComment, {
    nullable: true,
  })
  @Field(() => [Comment], { nullable: true })
  subComment?: Promise<Comment[]>;

  @ManyToOne(() => Comment, (comment) => comment.subComment, { nullable: true })
  @Field(() => Comment, { nullable: true })
  parentComment?: Promise<Comment>;
}
