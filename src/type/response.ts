import { Expose } from 'class-transformer';

export class ResponseType<T> {
  @Expose()
  status: string;
  @Expose()
  token?: string;
  @Expose()
  length?: number;
  @Expose()
  first?: number;
  @Expose()
  last?: number;
  @Expose()
  total?: number;
  @Expose()
  data?: {
    data: T[] | T;
  };
}
