import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_TIER_KEY } from '../decorators/required-tier.decorator';
import { UsersService } from '../../modules/users/users.service';

const TIER_HIERARCHY: Record<string, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredTier = this.reflector.get<string>(REQUIRED_TIER_KEY, context.getHandler());
    if (!requiredTier) return true;

    const { user } = context.switchToHttp().getRequest();
    const userData = await this.usersService.findById(user.uid);

    if (!userData) {
      throw new ForbiddenException('User not found');
    }
    const userTierLevel = TIER_HIERARCHY[userData.subscription?.plan || 'free'] || 0;
    const requiredTierLevel = TIER_HIERARCHY[requiredTier] || 0;

    if (userTierLevel < requiredTierLevel) {
      throw new ForbiddenException(
        `This feature requires a ${requiredTier} subscription or higher`,
      );
    }

    return true;
  }
}
