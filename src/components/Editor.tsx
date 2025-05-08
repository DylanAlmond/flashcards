import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel';

import {
  Flashcard,
  FlashcardContent,
  FlashcardQuestion,
  FlashcardTitle
} from './Flashcard';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from './ui/sidebar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { byteSize, cn, encodeFlashcardSet } from '@/lib/utils';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, Plus, Share, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { produce } from 'immer';
import AutoText from './AutoText';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { QRCodeCanvas } from 'qrcode.react';
import CopyBox from './CopyBox';
import { type FlashcardSet } from '@/lib/types';

const DEFAULT_DATA: () => FlashcardSet = () => {
  const id = nanoid();
  return {
    title: 'Untitled Set',
    cards: {
      [id]: {
        id: id,
        question: 'New Flashcard',
        answer: 'New Answer'
      }
    }
  };
};

interface EditorProps {
  initialData?: FlashcardSet;
}

const Editor = ({ initialData }: EditorProps) => {
  const [data, setData] = useState<FlashcardSet>(initialData || DEFAULT_DATA());
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const count = useMemo(() => Object.keys(data.cards).length, [data.cards]);

  const [encodedData, setEncodedData] = useState<string | null>(null);
  const encodedDataByteSize = useMemo(
    () => (encodedData ? byteSize(encodedData) : -1),
    [encodedData]
  );

  const handleShareCode = useCallback(async () => {
    if (!encodedData) return;

    try {
      const shareData = {
        title: data.title,
        text: 'Check out these Flashcards!',
        url: `${window.location.origin}/view?data=${encodedData}`
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        throw new Error('Sharing not supported or file not shareable.');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, [encodedData]);

  const handleShare = useCallback(() => {
    const encoded = encodeFlashcardSet(data);

    console.log(`${window.location.origin}/view?data=${encoded}`);

    setEncodedData(encoded);
  }, [data]);

  const addSlide = useCallback(() => {
    const id = nanoid();
    setData(
      produce((draft) => {
        draft.cards[id] = {
          id,
          question: 'New Flashcard',
          answer: 'New Answer'
        };
      })
    );

    // Scroll to the new card AFTER the state updates
    // Delay allows Carousel to render new slide
    setTimeout(() => {
      const newIndex = Object.keys(data.cards).length; // index is zero-based
      api?.scrollTo(newIndex); // go to the new (last) slide
    }, 0);
  }, [api, data.cards]);

  const deleteSlide = useCallback(
    (cardId: string) => {
      if (count > 1) {
        setData(
          produce((draft) => {
            delete draft.cards[cardId];
          })
        );
      }
    },
    [count]
  );

  const updateCard = useCallback(
    (cardId: string, question: string, answer: string) => {
      setData(
        produce((draft) => {
          if (draft.cards[cardId]) {
            draft.cards[cardId].question = question;
            draft.cards[cardId].answer = answer;
          }
        })
      );
    },
    []
  );

  const updateTitle = useCallback((title: string) => {
    setData(
      produce((draft) => {
        draft.title = title;
      })
    );
  }, []);

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

  console.log(data.title);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Cards</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Object.values(data.cards).map((card, index) => (
                  <SidebarMenuItem key={card.id}>
                    <SidebarMenuButton
                      asChild
                      onClick={() => api?.scrollTo(index)}
                    >
                      <FlashcardQuestion
                        className={cn(
                          current === index + 1 && 'border-primary border-2',
                          'relative h-full w-full text-center select-none'
                        )}
                      >
                        <Button
                          className="absolute top-2 right-2 h-8 w-8"
                          size={'icon'}
                          variant={'outline'}
                          hidden={count < 2}
                          onClick={(e) => (
                            e.stopPropagation(), deleteSlide(card.id)
                          )}
                        >
                          <X />
                          <span className="sr-only">Delete</span>
                        </Button>
                        <FlashcardTitle>{card.question}</FlashcardTitle>
                      </FlashcardQuestion>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                  <SidebarMenuButton asChild onClick={() => addSlide()}>
                    <FlashcardQuestion
                      className={
                        'relative h-full w-full text-center select-none'
                      }
                    >
                      <span className="sr-only">Add Card</span>
                      <Plus className="text-primary size-8!" />
                    </FlashcardQuestion>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden p-4">
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4">
          <SidebarTrigger />

          <p
            className="text-center font-semibold"
            contentEditable={true}
            suppressContentEditableWarning
            aria-label="Title"
            role="textbox"
            onBlur={(e) => {
              updateTitle(e.currentTarget.textContent || 'Untitled');
            }}
          >
            {data.title}
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleShare} variant={'default'}>
                <Share />
                <span className="sr-only sm:not-sr-only">Save</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Flashcard Set</DialogTitle>
                <DialogDescription>
                  Share your Flashcards as a URL or scannable QR code.
                </DialogDescription>
              </DialogHeader>

              {encodedData ? (
                <>
                  {encodedDataByteSize < 2953 ? (
                    <QRCodeCanvas
                      value={`${window.location.origin}/view?data=${encodedData}`}
                      size={256}
                      className="mx-auto"
                    />
                  ) : (
                    <p className="text-destructive">
                      Oops! The flashcard set is too large to be encoded into a
                      QR code.
                    </p>
                  )}

                  <Button
                    onClick={handleShareCode}
                    disabled={!navigator.canShare}
                  >
                    Share Code
                  </Button>

                  <CopyBox value={encodedData} />
                </>
              ) : (
                <p className="text-destructive">Unable to generate share code.</p>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Carousel
          setApi={setApi}
          className="flex h-full w-full flex-col justify-center"
        >
          <CarouselContent className="h-full">
            {Object.values(data.cards).map((card, index) => (
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
                      className="w-full font-semibold"
                      role="textbox"
                      contentEditable
                      aria-label="Flashcard Question"
                      suppressContentEditableWarning={true}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) =>
                        updateCard(
                          card.id,
                          e.currentTarget.textContent ?? 'No Question',
                          card.answer
                        )
                      }
                    >
                      {card.question}
                    </AutoText>
                  </FlashcardQuestion>

                  <FlashcardContent className="bg-primary text-primary-foreground w-full">
                    <AutoText
                      maxFontSize={48}
                      minFontSize={20}
                      contentEditable
                      suppressContentEditableWarning={true}
                      aria-label="Flashcard Answer"
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) =>
                        updateCard(
                          card.id,
                          card.question,
                          e.currentTarget.textContent ?? 'No Answer'
                        )
                      }
                    >
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
            <span className="sr-only sm:not-sr-only">Previous Card</span>
          </Button>

          <p className="text-secondary-foreground m-auto text-lg font-semibold">
            {current} of {count}
          </p>

          {api?.canScrollNext() ? (
            <Button
              onClick={() =>
                api.canScrollNext() ? api.scrollNext() : addSlide()
              }
              variant={'outline'}
            >
              <span className="sr-only sm:not-sr-only">Next Card</span>
              <ArrowRight />
            </Button>
          ) : (
            <Button onClick={addSlide} variant={'default'}>
              <span className="sr-only sm:not-sr-only">Add New Card</span>
              <Plus />
            </Button>
          )}
        </nav>
      </div>
    </SidebarProvider>
  );
};

export default Editor;
