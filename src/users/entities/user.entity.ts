import { Expose, Type } from 'class-transformer';

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
export class User {
  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ unique: true })
  username: string;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column({ unique: true })
  email: string;

  @Expose()
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
