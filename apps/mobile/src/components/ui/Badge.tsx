import React from 'react';
import { Text, View } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-stone-100 text-stone-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  brand: 'bg-brand-100 text-brand-700',
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <View
      className={[
        'rounded-full items-center justify-center self-start',
        size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1',
      ].join(' ')}
      style={{ backgroundColor: variantClasses[variant].includes('bg-') ? undefined : undefined }}
    >
      <Text
        className={[
          variantClasses[variant],
          size === 'sm' ? 'text-xs font-medium' : 'text-sm font-medium',
        ].join(' ')}
      >
        {children}
      </Text>
    </View>
  );
}
