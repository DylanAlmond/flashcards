import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel';
import { Flashcard, FlashcardContent, FlashcardQuestion } from './Flashcard';
import { useCallback, useEffect, useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import { ArrowLeft, ArrowRight, Dice5, Pen } from 'lucide-react';
import AutoText from './AutoText';
import { type FlashcardSet, type FlashcardType } from '@/lib/types';
import { Link } from '@tanstack/react-router';
import { encodeFlashcardSet, fy } from '@/lib/utils';

interface PreviewProps {
  data: FlashcardSet;
}

const Preview = ({ data }: PreviewProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [cards, setCards] = useState<FlashcardType[]>([]);

  const shuffleCards = useCallback(() => {
    setCards((p) => {
      fy(p);
      return [...p];
    });
  }, [cards, api]);

  useEffect(() => {
    setCards(Object.values(data.cards));
  }, [data]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    api.on('slidesChanged', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden p-4">
      <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4">
        <Button
          variant={'outline'}
          size={'icon'}
          className="ml-auto"
          onClick={shuffleCards}
        >
          <Dice5 />
        </Button>

        <p className="text-center font-semibold">{data.title}</p>

        <Link
          className={buttonVariants({ variant: 'default' })}
          to={'/edit'}
          search={{ data: encodeFlashcardSet(data) }}
        >
          <Pen />
          <span className="hidden sm:block">Edit</span>
        </Link>
      </div>

      <Carousel
        setApi={setApi}
        className="flex h-full w-full flex-col justify-center"
      >
        <CarouselContent className="h-full">
          {cards.map((card, index) => (
            <CarouselItem key={card.id}>
              <Flashcard
                size={'full'}
                className="mx-auto"
                flipped={current != index + 1 ? false : null}
              >
                <FlashcardQuestion>
                  <AutoText
                    maxFontSize={48}
                    minFontSize={20}
                    className="font-semibold"
                    role="textbox"
                  >
                    {card.question}
                  </AutoText>
                </FlashcardQuestion>

                <FlashcardContent className="bg-primary text-primary-foreground w-full">
                  <AutoText maxFontSize={48} minFontSize={20}>
                    {card.answer}
                  </AutoText>
                </FlashcardContent>
              </Flashcard>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <nav className="grid w-full grid-cols-3 items-center">
        <Button
          disabled={!api?.canScrollPrev()}
          onClick={() => api?.scrollPrev()}
          variant={'outline'}
        >
          <ArrowLeft />
        </Button>

        <p className="text-secondary-foreground m-auto text-sm font-semibold">
          {current} of {cards.length}
        </p>

        <Button
          disabled={!api?.canScrollNext()}
          onClick={() => api?.scrollNext()}
          variant={api?.canScrollNext() ? 'default' : 'outline'}
        >
          <ArrowRight />
        </Button>
      </nav>
    </div>
  );
};

export default Preview;
