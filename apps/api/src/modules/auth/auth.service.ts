import { Injectable, Logger } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { UserRole } from '@flacroncv/shared-types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private firebaseAdmin: FirebaseAdminService,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  async verifyAndSync(uid: string, email: string, displayName: string, emailVerified: boolean, photoURL?: string) {
    const ref = this.firebaseAdmin.firestore.collection('users').doc(uid);
    let user = await this.usersService.findById(uid);

    if (!user) {
      // ── New user ─────────────────────────────────────────────────────────
      user = await this.usersService.create({
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: photoURL || null,
      });
      this.logger.log(`New user created: ${uid}`);

      if (emailVerified) {
        // OAuth provider (Google/GitHub) — email already verified → welcome immediately
        await ref.update({ welcomeEmailSent: true });
        this.mailService.sendWelcomeEmail(email, user.displayName).catch((err) =>
          this.logger.error(`Welcome email failed for ${email}`, err),
        );
      } else {
        // Email/password signup — send verification first, welcome comes after they verify
        await ref.update({ welcomeEmailSent: false });
        this.generateAndSendVerification(uid, email, user.displayName).catch((err) =>
          this.logger.error(`Verification email failed for ${email}`, err),
        );
      }
    } else {
      // ── Returning user ───────────────────────────────────────────────────
      await this.usersService.updateLastLogin(uid);

      // Check if they just verified their email since last login
      if (emailVerified) {
        const doc = await ref.get();
        if (doc.data()?.welcomeEmailSent === false) {
          await ref.update({ welcomeEmailSent: true });
          this.mailService.sendWelcomeEmail(email, user.displayName).catch((err) =>
            this.logger.error(`Welcome email failed for ${email}`, err),
          );
        }
      }
    }

    return user;
  }

  async sendPasswordReset(email: string): Promise<void> {
    const link = await this.firebaseAdmin.auth.generatePasswordResetLink(email);
    const snapshot = await this.firebaseAdmin.firestore
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    const displayName: string = snapshot.empty ? '' : ((snapshot.docs[0].data().displayName as string) || '');
    await this.mailService.sendPasswordResetEmail(email, displayName, link);
  }

  async sendEmailVerification(uid: string): Promise<void> {
    const firebaseUser = await this.firebaseAdmin.auth.getUser(uid);
    const userEmail = firebaseUser.email || '';
    await this.generateAndSendVerification(uid, userEmail, firebaseUser.displayName || '');
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

  private async generateAndSendVerification(uid: string, email: string, displayName: string): Promise<void> {
    const link = await this.firebaseAdmin.auth.generateEmailVerificationLink(email);
    await this.mailService.sendEmailVerificationEmail(email, displayName, link);
  }
}
