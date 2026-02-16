import { Injectable, Logger } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { UsersService } from '../users/users.service';
import { UserRole, SubscriptionPlan } from '@flacroncv/shared-types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private firebaseAdmin: FirebaseAdminService,
    private usersService: UsersService,
  ) {}

  async verifyAndSync(uid: string, email: string, displayName: string, photoURL?: string) {
    let user = await this.usersService.findById(uid);

    if (!user) {
      user = await this.usersService.create({
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: photoURL || null,
      });
      this.logger.log(`New user created: ${uid}`);
    } else {
      await this.usersService.updateLastLogin(uid);
    }

    return user;
  }

  async setUserRole(uid: string, role: UserRole) {
    await this.firebaseAdmin.auth.setCustomUserClaims(uid, { role });
    await this.usersService.updateRole(uid, role);
    this.logger.log(`User ${uid} role set to ${role}`);
  }

  async revokeTokens(uid: string) {
    await this.firebaseAdmin.auth.revokeRefreshTokens(uid);
    this.logger.log(`Tokens revoked for user ${uid}`);
  }
}
