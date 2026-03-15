import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { useCVStore } from '../../../store/cv-store';
import { CVSectionType } from '../../../types/enums';
import { CertificationItem } from '../../../types/cv.types';
import { generateId } from '../../../lib/utils';

const schema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export function CertificationsStep({ onValidChange }: { onValidChange: (v: boolean) => void }) {
  const { sections, updateSection, addSection } = useCVStore();
  const [modalVisible, setModalVisible] = useState(false);
  const certSection = sections.find((s) => s.type === CVSectionType.CERTIFICATIONS);
  const items = (certSection?.items ?? []) as CertificationItem[];

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const newItem: CertificationItem = {
      id: generateId(),
      name: data.name,
      issuer: data.issuer,
      date: data.date,
      expiryDate: data.expiryDate,
      credentialId: data.credentialId,
      url: data.url || undefined,
    };
    if (certSection) {
      updateSection(certSection.id, { items: [...items, newItem] });
    } else {
      addSection({
        id: generateId(), type: CVSectionType.CERTIFICATIONS, title: 'Certifications',
        isVisible: true, order: sections.length, items: [newItem],
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      });
    }
    setModalVisible(false);
    onValidChange(true);
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 px-5">
        <Text className="text-lg font-bold text-stone-900 mb-1">Certifications</Text>
        <Text className="text-stone-500 mb-5 text-sm">Add your professional certifications and licenses.</Text>
        {items.map((item) => (
          <View key={item.id} className="bg-white border border-stone-100 rounded-xl p-4 mb-3">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="font-bold text-stone-900">{item.name}</Text>
                <Text className="text-stone-500 text-sm">{item.issuer}</Text>
                <Text className="text-stone-400 text-xs mt-1">{item.date}</Text>
              </View>
              <TouchableOpacity onPress={() => certSection && updateSection(certSection.id, { items: items.filter((i) => i.id !== item.id) })} className="p-1">
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <Button variant="outline" onPress={() => { reset({}); setModalVisible(true); }} icon={<Ionicons name="add" size={18} color="#374151" />} fullWidth>
          Add Certification
        </Button>
        <View className="h-8" />
      </ScrollView>
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)} title="Add Certification">
        <Controller control={control} name="name" render={({ field }) => (
          <Input label="Certification Name *" placeholder="AWS Solutions Architect" value={field.value} onChangeText={field.onChange} error={errors.name?.message} />
        )} />
        <Controller control={control} name="issuer" render={({ field }) => (
          <Input label="Issuing Organization *" placeholder="Amazon Web Services" value={field.value} onChangeText={field.onChange} error={errors.issuer?.message} />
        )} />
        <Controller control={control} name="date" render={({ field }) => (
          <Input label="Issue Date *" placeholder="Jan 2023" value={field.value} onChangeText={field.onChange} error={errors.date?.message} />
        )} />
        <Controller control={control} name="credentialId" render={({ field }) => (
          <Input label="Credential ID" placeholder="ABC123" value={field.value} onChangeText={field.onChange} />
        )} />
        <Button variant="primary" fullWidth onPress={handleSubmit(onSubmit)}>Add Certification</Button>
      </Modal>
    </View>
  );
}
