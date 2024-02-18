import { Expose } from 'class-transformer';
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
  @Column()
  avatar: string;

  @Column()
  password: string;

  @Expose()
  @Column()
  passwordChangedAt: Date;

  @Column()
  passwordResetToken: String;

  @Column()
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
  @ManyToMany(() => User, (user) => user.subcribes)
  subcribers: User[];

  @OneToMany(() => Video, (video) => video.idUser)
  videos: Video[];
}
