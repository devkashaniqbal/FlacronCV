import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { useCurrentUser, useUpdateProfile } from '../../../src/hooks/useUser';
import { getInitials } from '../../../src/lib/utils';

const schema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  'profile.firstName': z.string().optional(),
  'profile.lastName': z.string().optional(),
  'profile.headline': z.string().optional(),
  'profile.bio': z.string().optional(),
  'profile.location': z.string().optional(),
  'profile.website': z.string().url('Invalid URL').optional().or(z.literal('')),
  'profile.linkedin': z.string().optional(),
  'profile.github': z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ProfileScreen() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user?.displayName ?? '',
      'profile.firstName': user?.profile?.firstName ?? '',
      'profile.lastName': user?.profile?.lastName ?? '',
      'profile.headline': user?.profile?.headline ?? '',
      'profile.bio': user?.profile?.bio ?? '',
      'profile.location': user?.profile?.location ?? '',
      'profile.website': user?.profile?.website ?? '',
      'profile.linkedin': user?.profile?.linkedin ?? '',
      'profile.github': user?.profile?.github ?? '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile.mutateAsync({
        displayName: data.displayName,
        profile: {
          firstName: data['profile.firstName'] ?? '',
          lastName: data['profile.lastName'] ?? '',
          headline: data['profile.headline'],
          bio: data['profile.bio'],
          location: data['profile.location'],
          website: data['profile.website'],
          linkedin: data['profile.linkedin'],
          github: data['profile.github'],
        },
      } as any);
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-stone-100">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-black text-stone-900">Edit Profile</Text>
        </View>

        <ScrollView className="flex-1 px-5 pt-4" keyboardShouldPersistTaps="handled">
          {/* Avatar */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 rounded-full bg-brand-100 items-center justify-center">
              <Text className="text-brand-700 text-2xl font-black">
                {getInitials(user?.displayName ?? 'U')}
              </Text>
            </View>
          </View>

          <Controller control={control} name="displayName" render={({ field }) => (
            <Input label="Display Name *" value={field.value} onChangeText={field.onChange} error={errors.displayName?.message} />
          )} />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Controller control={control} name="profile.firstName" render={({ field }) => (
                <Input label="First Name" value={field.value} onChangeText={field.onChange} />
              )} />
            </View>
            <View className="flex-1">
              <Controller control={control} name="profile.lastName" render={({ field }) => (
                <Input label="Last Name" value={field.value} onChangeText={field.onChange} />
              )} />
            </View>
          </View>
          <Controller control={control} name="profile.headline" render={({ field }) => (
            <Input label="Professional Headline" placeholder="Senior Developer at Google" value={field.value} onChangeText={field.onChange} />
          )} />
          <Controller control={control} name="profile.bio" render={({ field }) => (
            <Input label="Bio" placeholder="A brief bio about yourself..." value={field.value} onChangeText={field.onChange} multiline numberOfLines={3} />
          )} />
          <Controller control={control} name="profile.location" render={({ field }) => (
            <Input label="Location" placeholder="San Francisco, CA" value={field.value} onChangeText={field.onChange} />
          )} />
          <Controller control={control} name="profile.website" render={({ field }) => (
            <Input label="Website" placeholder="https://yoursite.com" keyboardType="url" autoCapitalize="none" value={field.value} onChangeText={field.onChange} error={errors['profile.website']?.message} />
          )} />
          <Controller control={control} name="profile.linkedin" render={({ field }) => (
            <Input label="LinkedIn" placeholder="linkedin.com/in/yourprofile" autoCapitalize="none" value={field.value} onChangeText={field.onChange} />
          )} />
          <Controller control={control} name="profile.github" render={({ field }) => (
            <Input label="GitHub" placeholder="github.com/yourusername" autoCapitalize="none" value={field.value} onChangeText={field.onChange} />
          )} />

          <Button variant="primary" fullWidth size="lg" loading={updateProfile.isPending} onPress={handleSubmit(onSubmit)} className="mt-2">
            Save Profile
          </Button>
          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
