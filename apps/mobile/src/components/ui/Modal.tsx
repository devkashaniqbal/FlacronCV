import React from 'react';
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Modal({ visible, onClose, title, children, size = 'md' }: ModalProps) {
  const sizeClass =
    size === 'sm' ? 'max-h-64' :
    size === 'lg' ? 'max-h-5/6' :
    size === 'full' ? 'flex-1' :
    'max-h-2/3';

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable
            className={['bg-white rounded-t-3xl', sizeClass].join(' ')}
            onPress={() => {}}
          >
            {/* Handle */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-stone-200" />
            </View>

            {title && (
              <View className="flex-row items-center justify-between px-5 py-3 border-b border-stone-100">
                <Text className="text-lg font-bold text-stone-900">{title}</Text>
                <Pressable onPress={onClose} className="p-1">
                  <Ionicons name="close" size={22} color="#78716c" />
                </Pressable>
              </View>
            )}

            <ScrollView
              className="flex-1 px-5 py-4"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </RNModal>
  );
}
