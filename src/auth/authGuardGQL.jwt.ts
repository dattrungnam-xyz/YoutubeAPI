import { GqlExecutionContext } from '@nestjs/graphql';

import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './authGuard.jwt';

export class GQLJwtAuthGuard extends JwtAuthGuard {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
