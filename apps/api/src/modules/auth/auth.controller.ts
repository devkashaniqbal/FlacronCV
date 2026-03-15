import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, FirebaseUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@flacroncv/shared-types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async verify(@CurrentUser() user: FirebaseUser) {
    return this.authService.verifyAndSync(
      user.uid,
      user.email,
      (user as Record<string, unknown>).name as string || user.email,
      (user.emailVerified as boolean) || false,
      (user as Record<string, unknown>).picture as string,
    );
  }

  @Post('reset-password')
  @Throttle({ auth: { limit: 5, ttl: 900000 } })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { email: string }) {
    await this.authService.sendPasswordReset(body.email);
    return { message: 'Password reset email sent' };
  }

  @Post('send-verification')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async sendVerification(@CurrentUser() user: FirebaseUser) {
    await this.authService.sendEmailVerification(user.uid);
    return { message: 'Verification email sent' };
  }

  @Post('set-claims')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async setClaims(@Body() body: { uid: string; role: string }) {
    const validRoles = Object.values(UserRole) as string[];
    if (!validRoles.includes(body.role)) {
      throw new BadRequestException(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }
    await this.authService.setUserRole(body.uid, body.role as UserRole);
    return { message: `Role ${body.role} set for user ${body.uid}` };
  }

  @Post('revoke')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async revokeTokens(@Body() body: { uid: string }) {
    await this.authService.revokeTokens(body.uid);
    return { message: `Tokens revoked for user ${body.uid}` };
  }
}
