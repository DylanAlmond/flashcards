import ThemeToggle from '@/components/ThemeToggle';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Eye, GalleryVertical, Pen } from 'lucide-react';
import { useCallback, useState } from 'react';

export const Route = createFileRoute('/')({
  component: App
});

function App() {
  const navigate = useNavigate();
  const [previewCode, setPreviewCode] = useState<string>('');

  const handlePreview = useCallback(() => {
    if (previewCode) {
      navigate({
        to: '/view',
        search: { data: previewCode }
      });
    }
  }, [previewCode]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <ThemeToggle className="fixed top-4 right-4" />

      <Card>
        <CardContent className="flex flex-col gap-12">
          <div className="mt-2 flex flex-col items-center gap-6">
            <GalleryVertical size={112} className="text-primary" />
            <p className="text-4xl font-semibold">Flashcards</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                className="h-10"
                placeholder="Enter set code here"
                value={previewCode}
                onInput={(e) => setPreviewCode(e.currentTarget.value)}
              />
              <Button
                size={'lg'}
                variant={'outline'}
                onClick={handlePreview}
                disabled={!previewCode}
              >
                <Eye />
                <span>Preview</span>
              </Button>
            </div>

            <Link
              className={buttonVariants({ size: 'lg' })}
              to={'/edit'}
              search={{ data: '' }}
            >
              <Pen />
              <span>Create New Set</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
