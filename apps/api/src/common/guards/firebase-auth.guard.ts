import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseAdminService } from '../../modules/firebase/firebase-admin.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    private readonly firebaseAdmin: FirebaseAdminService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      const decodedToken = await this.firebaseAdmin.auth.verifyIdToken(token);
      request.user = {
        ...decodedToken,
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || 'user',
        emailVerified: decodedToken.email_verified,
      };
      return true;
    } catch (error) {
      // In development, decode JWT without verification as fallback
      const isDev = this.configService.get<string>('nodeEnv') === 'development';
      if (isDev) {
        try {
          const payload = this.decodeJwtPayload(token);
          if (payload && payload.user_id) {
            this.logger.warn(`Dev mode: Using unverified token for user ${payload.user_id}`);
            request.user = {
              uid: payload.user_id,
              email: payload.email || '',
              role: payload.role || 'user',
              emailVerified: payload.email_verified || false,
              ...payload,
            };
            return true;
          }
        } catch (decodeError) {
          this.logger.warn(`Dev mode: Failed to decode JWT: ${(decodeError as Error).message}`);
        }
      }

      this.logger.warn(`Token verification failed: ${(error as Error).message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: { headers: { authorization?: string } }): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }

  private decodeJwtPayload(token: string): Record<string, any> | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = Buffer.from(parts[1], 'base64url').toString('utf8');
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }
}
