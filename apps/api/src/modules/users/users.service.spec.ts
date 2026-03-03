import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { InMemoryFirestore } from '../firebase/in-memory-firestore';
import { UserRole, SubscriptionPlan } from '@flacroncv/shared-types';

function makeFirebaseAdmin(firestore: InMemoryFirestore) {
  return { firestore } as any;
}

describe('UsersService', () => {
  let service: UsersService;
  let firestore: InMemoryFirestore;

  beforeEach(() => {
    firestore = new InMemoryFirestore();
    service = new UsersService(makeFirebaseAdmin(firestore));
  });

  describe('create', () => {
    it('returns a well-formed User with role=user, plan=free, aiCreditsLimit=5', async () => {
      const user = await service.create({
        uid: 'uid-1',
        email: 'user@example.com',
        displayName: 'Test User',
        photoURL: null,
      });

      expect(user.uid).toBe('uid-1');
      expect(user.email).toBe('user@example.com');
      expect(user.role).toBe(UserRole.USER);
      expect(user.subscription.plan).toBe(SubscriptionPlan.FREE);
      expect(user.usage.aiCreditsLimit).toBe(5);
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    it('returns null when user does not exist', async () => {
      const result = await service.findById('non-existent');
      expect(result).toBeNull();
    });

    it('returns the user when it exists', async () => {
      await service.create({ uid: 'uid-2', email: 'a@b.com', displayName: 'A', photoURL: null });
      const result = await service.findById('uid-2');
      expect(result).not.toBeNull();
      expect(result!.uid).toBe('uid-2');
    });
  });

  describe('findByIdOrThrow', () => {
    it('throws NotFoundException when user does not exist', async () => {
      await expect(service.findByIdOrThrow('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates profile fields via dot-notation and returns updated user', async () => {
      await service.create({ uid: 'uid-3', email: 'c@d.com', displayName: 'C D', photoURL: null });

      const updated = await service.update('uid-3', {
        profile: { firstName: 'Updated', headline: 'Engineer' },
      });

      expect(updated.profile.firstName).toBe('Updated');
      expect(updated.profile.headline).toBe('Engineer');
    });
  });

  describe('listUsers', () => {
    beforeEach(async () => {
      await service.create({ uid: 'u1', email: 'u1@t.com', displayName: 'User One', photoURL: null });
      await service.create({ uid: 'u2', email: 'u2@t.com', displayName: 'User Two', photoURL: null });
    });

    it('returns all active users without filters', async () => {
      const result = await service.listUsers(1, 10);
      expect(result.items.length).toBeGreaterThanOrEqual(2);
      expect(result.total).toBeGreaterThanOrEqual(2);
    });

    it('filters by role', async () => {
      const result = await service.listUsers(1, 10, { role: UserRole.USER });
      expect(result.items.every((u) => u.role === UserRole.USER)).toBe(true);
    });

    it('returns pagination metadata', async () => {
      const result = await service.listUsers(1, 1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.totalPages).toBeGreaterThanOrEqual(1);
    });
  });
});
