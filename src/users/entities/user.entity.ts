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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  avatar: string;

  @Column()
  password: string;

  @Column()
  passwordChangedAt: Date;

  @Column()
  passwordResetToken: String;

  @Column()
  passwordResetExpires: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createAt: Date;

  @ManyToMany(() => User, (user) => user.subcribers)
  @JoinTable()
  subcribes: User[];

  @ManyToMany(() => User, (user) => user.subcribes)
  subcribers: User[];

  @OneToMany(() => Video, (video) => video.idUser)
  videos: Video[];
}
