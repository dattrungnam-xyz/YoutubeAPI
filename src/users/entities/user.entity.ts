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
  subcribes: User[];

  @Expose()
  @ManyToMany(() => User, (user2) => user2.subcribes)
  subcribers: User[];

  @OneToMany(() => Video, (video) => video.user, {})
  videos: Video[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
