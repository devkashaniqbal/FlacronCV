import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useCVStore } from '../../store/cv-store';
import { useUpdateCV, useUpdateCVSection } from '../../hooks/useCVs';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { SummaryStep } from './steps/SummaryStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ProjectsStep } from './steps/ProjectsStep';
import { CertificationsStep } from './steps/CertificationsStep';
import { LanguagesStep } from './steps/LanguagesStep';
import { ReferencesStep } from './steps/ReferencesStep';

const STEPS = [
  { id: 'personal', label: 'Personal Info', icon: 'person-outline' },
  { id: 'summary', label: 'Summary', icon: 'document-text-outline' },
  { id: 'experience', label: 'Experience', icon: 'briefcase-outline' },
  { id: 'education', label: 'Education', icon: 'school-outline' },
  { id: 'skills', label: 'Skills', icon: 'code-slash-outline' },
  { id: 'projects', label: 'Projects', icon: 'construct-outline' },
  { id: 'certifications', label: 'Certifications', icon: 'ribbon-outline' },
  { id: 'languages', label: 'Languages', icon: 'language-outline' },
  { id: 'references', label: 'References', icon: 'people-outline' },
] as const;

interface CVWizardProps {
  cvId: string;
  onFinish: () => void;
}

export function CVWizard({ cvId, onFinish }: CVWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepValid, setStepValid] = useState(false);
  const { cv, sections, isDirty, setIsSaving, markClean, setLastSavedAt } = useCVStore();
  const updateCV = useUpdateCV(cvId);
  const isSavingRef = useRef(false);

  const handleValidChange = useCallback((isValid: boolean) => {
    setStepValid(isValid);
  }, []);

  const saveProgress = async () => {
    if (!isDirty || !cv || isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);
    try {
      await updateCV.mutateAsync(cv);
      markClean();
      setLastSavedAt(new Date());
    } catch {
      // Silent fail - don't interrupt user flow
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      await saveProgress();
      setCurrentStep((s) => s + 1);
    } else {
      await saveProgress();
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PersonalInfoStep onValidChange={handleValidChange} />;
      case 1: return <SummaryStep onValidChange={handleValidChange} />;
      case 2: return <ExperienceStep onValidChange={handleValidChange} />;
      case 3: return <EducationStep onValidChange={handleValidChange} />;
      case 4: return <SkillsStep onValidChange={handleValidChange} />;
      case 5: return <ProjectsStep onValidChange={handleValidChange} />;
      case 6: return <CertificationsStep onValidChange={handleValidChange} />;
      case 7: return <LanguagesStep onValidChange={handleValidChange} />;
      case 8: return <ReferencesStep onValidChange={handleValidChange} />;
      default: return null;
    }
  };

  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <View className="flex-1 bg-stone-50">
      {/* Progress Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-stone-100">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-semibold text-stone-600">
            Step {currentStep + 1} of {STEPS.length}
          </Text>
          <Text className="text-sm text-stone-400">
            {STEPS[currentStep].label}
          </Text>
        </View>
        {/* Progress bar */}
        <View className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-brand-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      {/* Step indicator dots */}
      <View className="flex-row justify-center gap-1.5 py-3 bg-white border-b border-stone-100">
        {STEPS.map((step, index) => (
          <View
            key={step.id}
            className={[
              'rounded-full',
              index === currentStep ? 'w-4 h-1.5 bg-brand-500' :
              index < currentStep ? 'w-1.5 h-1.5 bg-brand-300' :
              'w-1.5 h-1.5 bg-stone-200',
            ].join(' ')}
          />
        ))}
      </View>

      {/* Step Content */}
      <Animated.View
        key={currentStep}
        entering={FadeInRight.duration(200)}
        exiting={FadeOutLeft.duration(150)}
        className="flex-1"
      >
        {renderStep()}
      </Animated.View>

      {/* Navigation Buttons */}
      <View className="flex-row gap-3 px-5 py-4 bg-white border-t border-stone-100">
        {currentStep > 0 && (
          <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center px-5 py-3 rounded-xl border border-stone-200 bg-stone-50"
          >
            <Ionicons name="chevron-back" size={18} color="#374151" />
            <Text className="text-stone-700 font-semibold ml-1">Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentStep === 0 && !stepValid}
          className={[
            'flex-1 flex-row items-center justify-center py-3 rounded-xl',
            currentStep === 0 && !stepValid ? 'bg-stone-200' : 'bg-brand-500',
          ].join(' ')}
        >
          <Text className={[
            'font-bold text-base',
            currentStep === 0 && !stepValid ? 'text-stone-400' : 'text-white',
          ].join(' ')}>
            {currentStep === STEPS.length - 1 ? 'Finish' : 'Continue'}
          </Text>
          <Ionicons
            name={currentStep === STEPS.length - 1 ? 'checkmark' : 'chevron-forward'}
            size={18}
            color={currentStep === 0 && !stepValid ? '#a8a29e' : '#fff'}
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
