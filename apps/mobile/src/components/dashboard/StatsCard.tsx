import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  subtitle?: string;
}

export function StatsCard({ label, value, icon, color = '#f97316', subtitle }: StatsCardProps) {
  return (
    <View className="flex-1 bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: color + '20' }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-2xl font-black text-stone-900">{value}</Text>
      <Text className="text-sm font-medium text-stone-600">{label}</Text>
      {subtitle && <Text className="text-xs text-stone-400 mt-0.5">{subtitle}</Text>}
    </View>
  );
}
