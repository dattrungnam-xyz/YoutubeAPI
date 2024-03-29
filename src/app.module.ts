import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { dataSourceOptions } from './config/typeorm.config';

import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { UsersModule } from './users/users.module';
import { CommentModule } from './comment/comment.module';
import { MailModule } from './mail/mail.module';
import { ReactionModule } from './reaction/reaction.module';
import { AppResolver } from './app.resolver';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    CloudinaryModule,
    AuthModule,
    VideoModule,
    UsersModule,
    CommentModule,
    MailModule,
    ReactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
