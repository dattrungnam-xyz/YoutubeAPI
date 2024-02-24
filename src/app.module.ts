import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';

import { dataSourceOptions } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { TestModule } from './test/test.module';
import { CommentModule } from './comment/comment.module';
import { MailModule } from './mail/mail.module';
import { ReactionModule } from './reaction/reaction.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [typeorm],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) =>
    //     configService.get('typeorm'),
    // }),
    CloudinaryModule,
    AuthModule,
    VideoModule,
    UsersModule,
    TestModule,
    CommentModule,
    MailModule,
    ReactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
