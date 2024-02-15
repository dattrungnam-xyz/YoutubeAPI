import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { LocalStrategy } from './local.strategy';
import { UserDoesNotExistConstraint } from 'src/validation/UserDoesNotExist.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,UserDoesNotExistConstraint],
})
export class AuthModule {}
