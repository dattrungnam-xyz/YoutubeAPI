import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
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

registerEnumType(ReactionType, {
  name: 'ReactionType',
});

@Entity()
@ObjectType()
export class Reaction {
  constructor(partial?: Partial<Reaction>) {
    Object.assign(this, partial);
  }
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reactions)
  @Field(() => User, { nullable: true })
  user: Promise<User>;

  @Column({
    type: 'enum',
    enum: ReactionType,
    default: ReactionType.LIKE,
  })
  @Field(() => ReactionType)
  type: ReactionType;

  @ManyToOne(() => Comment, (comment) => comment.reactions)
  @Field(() => Comment, { nullable: true })
  comment?: Promise<Comment>;

  @ManyToOne(() => Video, (video) => video.reactions)
  @Field(() => Video, { nullable: true })
  video?: Promise<Video>;

  @Field()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
}
