import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class MessageOutput {
  constructor(partial?: Partial<MessageOutput>) {
    Object.assign(this, partial);
  }
  @Field()
  message: string;
}
