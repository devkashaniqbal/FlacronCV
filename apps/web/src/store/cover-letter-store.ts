import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  CoverLetter,
  CoverLetterStyling,
  UpdateCoverLetterData,
} from '@flacroncv/shared-types';

interface CoverLetterState {
  coverLetter: CoverLetter | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;

  // Actions
  setCoverLetter: (cl: CoverLetter) => void;
  updateField: <K extends keyof UpdateCoverLetterData>(
    field: K,
    value: UpdateCoverLetterData[K],
  ) => void;
  setContent: (content: string) => void;
  updateStyling: (field: keyof CoverLetterStyling, value: string) => void;
  setSaving: (saving: boolean) => void;
  setDirty: (dirty: boolean) => void;
  setLastSavedAt: (date: Date) => void;
  markClean: () => void;
  reset: () => void;
}

export const useCoverLetterStore = create<CoverLetterState>()(
  immer((set) => ({
    coverLetter: null,
    isDirty: false,
    isSaving: false,
    lastSavedAt: null,

    setCoverLetter: (cl) =>
      set((state) => {
        state.coverLetter = cl;
        state.isDirty = false;
      }),

    updateField: (field, value) =>
      set((state) => {
        if (state.coverLetter) {
          (state.coverLetter as any)[field] = value;
          state.isDirty = true;
        }
      }),

    setContent: (content) =>
      set((state) => {
        if (state.coverLetter) {
          state.coverLetter.content = content;
          state.isDirty = true;
        }
      }),

    updateStyling: (field, value) =>
      set((state) => {
        if (state.coverLetter) {
          state.coverLetter.styling[field] = value;
          state.isDirty = true;
        }
      }),

    setSaving: (saving) =>
      set((state) => {
        state.isSaving = saving;
      }),

    setDirty: (dirty) =>
      set((state) => {
        state.isDirty = dirty;
      }),

    setLastSavedAt: (date) =>
      set((state) => {
        state.lastSavedAt = date;
        state.isDirty = false;
      }),

    markClean: () =>
      set((state) => {
        state.isDirty = false;
      }),

    reset: () =>
      set((state) => {
        state.coverLetter = null;
        state.isDirty = false;
        state.isSaving = false;
        state.lastSavedAt = null;
      }),
  })),
);
