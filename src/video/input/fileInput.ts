import { Field, InputType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from './fileUpload';

@InputType()
export class FileInput {
  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;
}
