import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface FirebaseUser {
  uid: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export const CurrentUser = createParamDecorator(
  (data: keyof FirebaseUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as FirebaseUser;
    return data ? user?.[data] : user;
  },
);
