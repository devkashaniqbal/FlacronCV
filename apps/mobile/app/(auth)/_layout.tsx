import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../src/store/auth-store';

export default function AuthLayout() {
  const { firebaseUser, isInitialized } = useAuthStore();

  if (isInitialized && firebaseUser) {
    return <Redirect href="/(dashboard)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
