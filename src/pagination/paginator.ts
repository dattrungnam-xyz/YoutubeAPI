import { Type } from '@nestjs/common';
import { Expose } from 'class-transformer';

export function paginate<T>(classRef: Type<T>) {
  class PaginationResult<T> {
    @Expose()
    first: number;
    @Expose()
    last: number;
    @Expose()
    limit: number;
    @Expose()
    total?: number;
    @Expose()
    data: T[];
  }
  return PaginationResult<T>
}

