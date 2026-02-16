import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, FirebaseUser } from '../../common/decorators/current-user.decorator';

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
      (user as Record<string, unknown>).picture as string,
    );
  }

  @Post('set-claims')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async setClaims(@Body() body: { uid: string; role: string }) {
    await this.authService.setUserRole(body.uid, body.role as any);
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
