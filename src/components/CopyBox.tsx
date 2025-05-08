import { useCallback, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check, Copy } from 'lucide-react';

type CopyBoxProps = {
  value: string;
} & React.ComponentPropsWithoutRef<'div'>;

const CopyBox = ({ value }: CopyBoxProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = useCallback(async () => {
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
    } catch (error) {
      console.error(error);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input type="text" value={value} readOnly />
        <Button
          variant={copied ? 'default' : 'outline'}
          size={'icon'}
          onClick={handleCopy}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
    </div>
  );
};

export default CopyBox;
