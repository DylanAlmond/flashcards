import Editor from '@/components/Editor';
import { decodeFlashcardSet } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { z } from 'zod';

const editSearchSchema = z.object({
  data: z.string().catch('')
});

export const Route = createFileRoute('/edit')({
  component: RouteComponent,
  validateSearch: (search) => editSearchSchema.parse(search)
});

function RouteComponent() {
  const { data } = Route.useSearch();
  const decodedData = useMemo(() => decodeFlashcardSet(data), [data]);

  return <Editor initialData={decodedData || undefined} />;
}
