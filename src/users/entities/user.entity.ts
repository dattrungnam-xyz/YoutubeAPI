import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Comment } from 'src/comment/entities/comment.entity';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { Video } from 'src/video/entities/video.entity';
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
  subcribes: Promise<User[]>;

  @Expose()
  @ManyToMany(() => User, (user2) => user2.subcribes)
  subcribers: Promise<User[]>;

  @OneToMany(() => Video, (video) => video.user, {})
  videos: Promise<Video[]>;

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Promise<Reaction[]>;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Promise<Comment[]>;
}
