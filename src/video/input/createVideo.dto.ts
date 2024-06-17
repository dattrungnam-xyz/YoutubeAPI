import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
@InputType()
export class CreateVideoDTO {
  @IsOptional()
  @Field({ nullable: true })
  thumbnailUrl?: string;

  @IsOptional()
  @Field({ nullable: true })
  videoUrl?: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;
}
