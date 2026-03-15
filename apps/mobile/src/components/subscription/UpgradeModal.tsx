import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  feature: string;
  requiredPlan?: string;
}

export function UpgradeModal({ visible, onClose, feature, requiredPlan = 'Pro' }: UpgradeModalProps) {
  const router = useRouter();

  return (
    <Modal visible={visible} onClose={onClose} title="Upgrade Required">
      <View className="items-center py-4">
        <View className="w-16 h-16 rounded-full bg-brand-50 items-center justify-center mb-4">
          <Ionicons name="lock-closed" size={28} color="#f97316" />
        </View>
        <Text className="text-lg font-bold text-stone-900 text-center mb-2">
          {requiredPlan} Feature
        </Text>
        <Text className="text-stone-500 text-center mb-6 leading-5">
          <Text className="font-semibold text-stone-700">{feature}</Text> requires a{' '}
          {requiredPlan} plan or higher. Upgrade to unlock this and many more features.
        </Text>

        <View className="w-full gap-3">
          <Button
            variant="primary"
            fullWidth
            onPress={() => {
              onClose();
              router.push('/(dashboard)/settings/billing');
            }}
          >
            Upgrade to {requiredPlan}
          </Button>
          <Button variant="ghost" fullWidth onPress={onClose}>
            Maybe Later
          </Button>
        </View>
      </View>
    </Modal>
  );
}
