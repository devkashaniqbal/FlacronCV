import { create } from 'zustand';
import { CoverLetter } from '../types/cover-letter.types';

interface CoverLetterStoreState {
  coverLetter: CoverLetter | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;

  setCoverLetter: (cl: CoverLetter) => void;
  updateField: (field: keyof CoverLetter, value: string) => void;
  setContent: (content: string) => void;
  updateStyling: (field: string, value: string) => void;
  setSaving: (value: boolean) => void;
  setDirty: (value: boolean) => void;
  setLastSavedAt: (date: Date) => void;
  markClean: () => void;
  reset: () => void;
}

export const useCoverLetterStore = create<CoverLetterStoreState>((set, get) => ({
  coverLetter: null,
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,

  setCoverLetter: (cl) => set({ coverLetter: cl, isDirty: false }),

  updateField: (field, value) => {
    const { coverLetter } = get();
    if (!coverLetter) return;
    set({
      coverLetter: { ...coverLetter, [field]: value },
      isDirty: true,
    });
  },

  setContent: (content) => {
    const { coverLetter } = get();
    if (!coverLetter) return;
    set({ coverLetter: { ...coverLetter, content }, isDirty: true });
  },

  updateStyling: (field, value) => {
    const { coverLetter } = get();
    if (!coverLetter) return;
    set({
      coverLetter: {
        ...coverLetter,
        styling: { ...coverLetter.styling, [field]: value },
      },
      isDirty: true,
    });
  },

  setSaving: (value) => set({ isSaving: value }),
  setDirty: (value) => set({ isDirty: value }),
  setLastSavedAt: (date) => set({ lastSavedAt: date }),
  markClean: () => set({ isDirty: false }),
  reset: () => set({ coverLetter: null, isDirty: false, isSaving: false, lastSavedAt: null }),
}));
