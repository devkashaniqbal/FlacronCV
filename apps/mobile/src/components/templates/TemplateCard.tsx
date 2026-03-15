import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Template } from '../../types/template.types';
import { SubscriptionPlan } from '../../types/enums';

interface TemplateCardProps {
  template: Template;
  isSelected?: boolean;
  isLocked?: boolean;
  onSelect: () => void;
  onPreview?: () => void;
}

export function TemplateCard({ template, isSelected, isLocked, onSelect, onPreview }: TemplateCardProps) {
  const tierColors: Record<SubscriptionPlan, { bg: string; text: string; label: string }> = {
    [SubscriptionPlan.FREE]: { bg: '#f0fdf4', text: '#15803d', label: 'Free' },
    [SubscriptionPlan.PRO]: { bg: '#fef3c7', text: '#b45309', label: 'Pro' },
    [SubscriptionPlan.ENTERPRISE]: { bg: '#f3e8ff', text: '#7c3aed', label: 'Enterprise' },
  };

  const tier = tierColors[template.tier];

  return (
    <Pressable
      onPress={onSelect}
      className={[
        'rounded-2xl overflow-hidden border-2',
        isSelected ? 'border-brand-500' : 'border-stone-100',
      ].join(' ')}
    >
      {/* Template Thumbnail */}
      <View className="h-48 bg-stone-100 items-center justify-center relative">
        {template.thumbnailURL ? (
          <Image
            source={{ uri: template.thumbnailURL }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="items-center">
            <Ionicons name="document-text-outline" size={48} color="#d6d3d1" />
            <Text className="text-stone-300 text-sm mt-2">{template.name}</Text>
          </View>
        )}

        {/* Tier Badge */}
        <View
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full"
          style={{ backgroundColor: tier.bg }}
        >
          <Text className="text-xs font-bold" style={{ color: tier.text }}>
            {tier.label}
          </Text>
        </View>

        {/* Lock Overlay */}
        {isLocked && (
          <View className="absolute inset-0 bg-black/40 items-center justify-center">
            <View className="bg-white/90 rounded-full p-3">
              <Ionicons name="lock-closed" size={24} color="#374151" />
            </View>
          </View>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <View className="absolute top-2 right-2 w-7 h-7 rounded-full bg-brand-500 items-center justify-center">
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        )}
      </View>

      {/* Template Info */}
      <View className="p-3 bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-stone-800">{template.name}</Text>
          {template.isFeatured && (
            <Ionicons name="star" size={14} color="#f97316" />
          )}
        </View>
        {template.description && (
          <Text className="text-stone-400 text-xs mt-0.5" numberOfLines={1}>
            {template.description}
          </Text>
        )}
        <View className="flex-row gap-1 mt-2">
          {template.colorSchemes.slice(0, 5).map((scheme, i) => (
            <View
              key={i}
              className="w-4 h-4 rounded-full border border-stone-200"
              style={{ backgroundColor: scheme.primary }}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}
