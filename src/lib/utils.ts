import { clsx, type ClassValue } from 'clsx';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent
} from 'lz-string';
import { twMerge } from 'tailwind-merge';
import { flashcardSetSchema, type FlashcardSet } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encodeFlashcardSet(data: FlashcardSet): string {
  const encoded = compressToEncodedURIComponent(JSON.stringify(data));
  return encoded;
}

export function decodeFlashcardSet(encodedString: string): FlashcardSet | null {
  try {
    const decompressed = decompressFromEncodedURIComponent(encodedString);
    const json = JSON.parse(decompressed);

    const res = flashcardSetSchema.safeParse(json);

    if (!res.success) throw res.error;

    return res.data;
  } catch (error) {
    console.error('Unable to decode flashcard set data:\n', error);
    return null;
  }
}

export function fy<T>(a: T[], b?: any, c?: any, d?: any) {
  //array,placeholder,placeholder,placeholder
  c = a.length;
  while (c)
    (b = (Math.random() * (--c + 1)) | 0),
      (d = a[c]),
      (a[c] = a[b]),
      (a[b] = d);
}
