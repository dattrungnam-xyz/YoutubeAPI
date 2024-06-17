import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Video } from '../../video/entities/video.entity';
import { Reaction } from '../../reaction/entities/reaction.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
@ObjectType()
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Expose()
  @Column({ unique: true })
  @Field()
  username: string;

  @Expose()
  @Column()
  @Field()
  name: string;

  @Expose()
  @Field()
  @Column({ unique: true })
  email: string;

  @Expose()
  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar: string;

  @Column()
  password: string;

  @Expose()
  @Column({ nullable: true })
  passwordChangedAt: Date;

  @Column({ nullable: true })
  passwordResetToken: String;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @Expose()
  @Field()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createAt: Date;

  @Expose()
  @ManyToMany(() => User, (user) => user.subcribers)
  @JoinTable()
  @Field(() => [User], { nullable: true })
  subcribes: Promise<User[]>;

  @Expose()
  @ManyToMany(() => User, (user2) => user2.subcribes)
  @Field(() => [User], { nullable: true })
  subcribers: Promise<User[]>;

  @OneToMany(() => Video, (video) => video.user, {})
  @Field(() => [Video], { nullable: true })
  videos: Promise<Video[]>;

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  @Field(() => [Reaction], { nullable: true })
  reactions: Promise<Reaction[]>;

  @OneToMany(() => Comment, (comment) => comment.user)
  @Field(() => [Comment], { nullable: true })
  comments: Promise<Comment[]>;
}
