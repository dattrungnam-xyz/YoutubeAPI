import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { LocalStrategy } from './local.strategy';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

import { AuthResolver } from './auth.resolver';
import { MailModule } from '../mail/mail.module';
import { UserDoesNotExistConstraint } from '../validation/UserDoesNotExist.constraint';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserDoesNotExistConstraint,
    AuthResolver
  ],
})
export class AuthModule {}
