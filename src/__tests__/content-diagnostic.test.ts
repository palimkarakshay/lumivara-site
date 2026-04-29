import { describe, it, expect } from "vitest";
import { diagnosticQuestions } from "@/content/diagnostic";

describe("diagnosticQuestions content", () => {
  it("exports at least 3 questions", () => {
    expect(diagnosticQuestions.length).toBeGreaterThanOrEqual(3);
  });

  it("each question has a non-empty id and prompt", () => {
    for (const q of diagnosticQuestions) {
      expect(q.id.length).toBeGreaterThan(0);
      expect(q.prompt.length).toBeGreaterThan(0);
    }
  });

  it("each question has at least 2 options", () => {
    for (const q of diagnosticQuestions) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("each option has a non-empty value and label", () => {
    for (const q of diagnosticQuestions) {
      for (const opt of q.options) {
        expect(opt.value.length).toBeGreaterThan(0);
        expect(opt.label.length).toBeGreaterThan(0);
      }
    }
  });

  it("question ids are unique", () => {
    const ids = diagnosticQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
