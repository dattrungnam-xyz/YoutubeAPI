import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
export class User {
  @PrimaryGeneratedColumn()
  id: Number;
  username: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
  passwordChangedAt: Date;
  passwordResetToken: String;
  passwordResetExpires: Date;
  createAt: Date;
}
