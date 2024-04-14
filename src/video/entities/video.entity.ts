import { Field, ObjectType } from '@nestjs/graphql';
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
