import { create } from "zustand";
import {
  diagnosticQuestions,
  type DiagnosticAnswers,
} from "@/content/diagnostic";

const total = diagnosticQuestions.length;

interface DiagnosticState {
  step: number;
  answers: DiagnosticAnswers;
  completed: boolean;
  pick: (value: string) => void;
  back: () => void;
  reset: () => void;
}

export const useDiagnosticStore = create<DiagnosticState>((set) => ({
  step: 0,
  answers: {},
  completed: false,
  pick: (value) =>
    set((state) => {
      const current = diagnosticQuestions[state.step];
      const next = { ...state.answers, [current.id]: value };
      if (state.step + 1 >= total) {
        return { answers: next, completed: true };
      }
      return { answers: next, step: state.step + 1 };
    }),
  back: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
  reset: () => set({ step: 0, answers: {}, completed: false }),
}));
