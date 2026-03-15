import * as SecureStore from 'expo-secure-store';

const KEYS = {
  AUTH_TOKEN: 'flacroncv_auth_token',
  REFRESH_TOKEN: 'flacroncv_refresh_token',
  USER_ID: 'flacroncv_user_id',
  PENDING_TEMPLATE: 'flacroncv_pending_template',
} as const;

export const secureStore = {
  async setAuthToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
  },

  async deleteAuthToken(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  },

  async deleteRefreshToken(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
  },

  async setUserId(uid: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.USER_ID, uid);
  },

  async getUserId(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.USER_ID);
  },

  async deleteUserId(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.USER_ID);
  },

  async setPendingTemplate(templateId: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.PENDING_TEMPLATE, templateId);
  },

  async getPendingTemplate(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.PENDING_TEMPLATE);
  },

  async deletePendingTemplate(): Promise<void> {
    await SecureStore.deleteItemAsync(KEYS.PENDING_TEMPLATE);
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.AUTH_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(KEYS.USER_ID),
    ]);
  },
};
