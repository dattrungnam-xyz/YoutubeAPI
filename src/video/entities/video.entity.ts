import { Expose } from 'class-transformer';
import { Comment } from 'src/comment/entities/comment.entity';
import { Reaction } from 'src/reaction/entities/reaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Video {
  constructor(partial?: Partial<Video>) {
    Object.assign(this, partial);
  }
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ nullable: false })
  thumbnailUrl: string;

  @Expose()
  @Column({ nullable: false })
  videoUrl: string;

  @Expose()
  @Column({ nullable: false })
  title: string;

  @Expose()
  @Column()
  description: string;

  @Expose()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createAt: Date;

  @Expose()
  @Column({ default: 0 })
  views: number;

  @Expose()
  @ManyToOne(() => User, (user) => user.videos, { nullable: false })
  user: Promise<User>;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Expose()
  @OneToMany(() => Comment, (comment) => comment.video)
  comments: Promise<Comment[]>;
  
  @Expose()
  @OneToMany(() => Reaction, (reaction) => reaction.video)
  reactions: Promise<Reaction[]>;
}
