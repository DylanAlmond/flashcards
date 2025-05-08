import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { useState } from 'react';

const flashcardVariants = cva(
  'transition-transform relative transform-3d flex-1 duration-700 text-card-foreground aspect-16/10 gap-6',
  {
    variants: {
      size: {
        default: 'w-md text-lg',
        sm: 'w-sm',
        lg: 'w-lg text-xl',
        xl: 'w-xl text-2xl',
        full: '@container h-full max-h-full max-w-5xl'
      },
      flipped: {
        true: 'rotate-x-180',
        false: 'rotate-x-0'
      }
    },
    defaultVariants: {
      size: 'default',
      flipped: false
    }
  }
);

function Flashcard({
  className,
  size,
  flipped,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof flashcardVariants>) {
  const [internalFlipped, setInternalFlipped] = useState<boolean>(
    flipped || false
  );

  React.useEffect(() => {
    if (typeof flipped === 'boolean') {
      setInternalFlipped(flipped);
    }
  }, [flipped]);

  return (
    <div
      data-slot="flashcard"
      onClick={() => setInternalFlipped(!internalFlipped)}
      className={cn(
        flashcardVariants({ size, flipped: internalFlipped }),
        className
      )}
      {...props}
    />
  );
}

function FlashcardQuestion({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="flashcard-question"
      className={cn(
        'bg-card absolute top-0 left-0 flex aspect-16/10 h-full max-h-full w-full max-w-full flex-col items-center justify-center rounded-xl border p-6 text-center text-lg backface-hidden @sm:text-2xl @md:text-3xl @lg:text-5xl',
        className
      )}
      {...props}
    />
  );
}

function FlashcardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="flashcard-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function FlashcardContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="flashcard-content"
      className={cn(
        'absolute top-0 left-0 flex aspect-16/10 h-full max-h-full max-w-full rotate-x-180 flex-col items-center justify-center self-center rounded-xl p-6 text-center text-lg backface-hidden @sm:text-2xl @md:text-3xl @lg:text-5xl',
        className
      )}
      {...props}
    />
  );
}

export { Flashcard, FlashcardQuestion, FlashcardTitle, FlashcardContent };
