import { zodResolver } from '@hookform/resolvers/zod';
import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useAuthStore } from '../../src/store/auth-store';

// Required for expo-auth-session redirect to work correctly
WebBrowser.maybeCompleteAuthSession();

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  // Google Auth Session
  const [, googleResponse, promptGoogleAsync] = Google.useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined,
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params;
      loginWithGoogle(id_token).catch(() => {});
    }
  }, [googleResponse]);

  const onSubmit = async (data: FormData) => {
    clearError();
    try {
      await login(data.email, data.password);
    } catch {
      // Error already set in store
    }
  };

  const onGooglePress = () => {
    if (!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
      Alert.alert(
        'Google Sign-In',
        'Google Sign-In requires a Web Client ID. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to your .env file (get it from Firebase Console → Authentication → Sign-in method → Google).',
      );
      return;
    }
    promptGoogleAsync();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <LinearGradient colors={['#fff7ed', '#ffffff']} className="px-6 pt-8 pb-10">
            <View className="items-center mb-8">
              <View
                className="w-14 h-14 rounded-2xl bg-brand-500 items-center justify-center mb-4"
                style={{
                  shadowColor: '#f97316',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <Image
                  source={require('../../assets/logo.png')}
                  style={{ width: 36, height: 36 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-2xl font-black text-stone-900">Welcome back</Text>
              <Text className="text-stone-500 mt-1">Sign in to your FlacronCV account</Text>
            </View>
          </LinearGradient>

          {/* Form Card */}
          <View className="px-6 -mt-4">
            <View className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
              {/* Error Banner */}
              {error && (
                <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <Text className="text-red-600 text-sm">{error}</Text>
                </View>
              )}

              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    label="Email Address"
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    isPassword
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.password?.message}
                  />
                )}
              />

              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity className="mb-5">
                  <Text className="text-brand-500 text-sm font-medium text-right">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </Link>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                onPress={handleSubmit(onSubmit)}
              >
                Sign In
              </Button>

              {/* Divider */}
              <View className="flex-row items-center my-5">
                <View className="flex-1 h-px bg-stone-200" />
                <Text className="mx-3 text-stone-400 text-sm font-medium">or continue with</Text>
                <View className="flex-1 h-px bg-stone-200" />
              </View>

              {/* Google Sign-In */}
              <TouchableOpacity
                onPress={onGooglePress}
                activeOpacity={0.85}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1.5,
                  borderColor: '#e7e5e4',
                  borderRadius: 14,
                  paddingVertical: 14,
                  gap: 10,
                  backgroundColor: '#fff',
                }}
              >
                {/* Google "G" logo */}
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '800', color: '#4285F4' }}>G</Text>
                </View>
                <Text
                  style={{ color: '#1c1917', fontSize: 15, fontWeight: '600' }}
                >
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center mt-6 mb-8">
              <Text className="text-stone-500">Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text className="text-brand-500 font-semibold">Sign up free</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
