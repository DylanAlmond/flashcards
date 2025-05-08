import Preview from '@/components/Preview';
import ThemeToggle from '@/components/ThemeToggle';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { decodeFlashcardSet } from '@/lib/utils';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Pen, Eye } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';

const editSearchSchema = z.object({
  data: z.string().catch('')
});

export const Route = createFileRoute('/view')({
  component: RouteComponent,
  validateSearch: (search) => editSearchSchema.parse(search)
});

function RouteComponent() {
  const { data } = Route.useSearch();
  const decodedData = useMemo(() => decodeFlashcardSet(data), [data]);

  const navigate = useNavigate();
  const [previewCode, setPreviewCode] = useState<string>(data || '');

  const handlePreview = useCallback(() => {
    if (previewCode) {
      navigate({
        to: '/view',
        search: { data: previewCode }
      });
    }
  }, [previewCode]);

  if (!decodedData)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <ThemeToggle className="fixed top-4 right-4" />

        <Card>
          <CardHeader>
            <CardTitle>Unable to load Flashcard Set</CardTitle>
            <CardDescription>
              Are you sure your set code is correct?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-12">
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
                  <span>Try Again</span>
                </Button>
              </div>

              <p className="text-muted-foreground mx-auto">Or...</p>

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

  return <Preview data={decodedData} />;
}
