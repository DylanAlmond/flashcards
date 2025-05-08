import { z } from 'zod';

// FlashcardType schema
export const flashcardTypeSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string()
});

// FlashcardSet schema
export const flashcardSetSchema = z.object({
  title: z.string(),
  cards: z.record(flashcardTypeSchema)
});

export type FlashcardType = z.infer<typeof flashcardTypeSchema>;
export type FlashcardSet = z.infer<typeof flashcardSetSchema>;
