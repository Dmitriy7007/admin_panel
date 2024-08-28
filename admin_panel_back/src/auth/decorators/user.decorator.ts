import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import prisma from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: keyof prisma.User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user[data] : request.user;
  },
);
