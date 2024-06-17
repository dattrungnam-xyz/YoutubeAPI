import { Field, ObjectType } from '@nestjs/graphql';
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
import { Reaction } from '../../reaction/entities/reaction.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@ObjectType()
export class Video {
  constructor(partial?: Partial<Video>) {
    Object.assign(this, partial);
  }
  @Expose()
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Field()
  @Column({ nullable: false })
  thumbnailUrl: string;

  @Expose()
  @Column({ nullable: false })
  @Field()
  videoUrl: string;

  @Expose()
  @Column({ nullable: false })
  @Field()
  title: string;

  @Expose()
  @Column()
  @Field()
  description: string;

  @Expose()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Field()
  createAt: Date;

  @Expose()
  @Column({ default: 0 })
  @Field()
  views: number;

  @Expose()
  @ManyToOne(() => User, (user) => user.videos, { nullable: false })
  @Field(() => User)
  user: Promise<User>;

  @DeleteDateColumn()
  @Field()
  deletedAt?: Date;

  @OneToMany(() => Comment, (comment) => comment.video)
  @Field(() => [Comment], { nullable: true })
  comments: Promise<Comment[]>;

  @OneToMany(() => Reaction, (reaction) => reaction.video)
  @Field(() => [Reaction], { nullable: true })
  reactions: Promise<Reaction[]>;
}
