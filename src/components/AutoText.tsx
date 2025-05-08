import React, { useRef, useEffect, useCallback } from 'react';

type AutoTextProps = {
  maxHeight?: number;
  minFontSize?: number;
  maxFontSize?: number;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const AutoText = ({
  maxHeight = 100,
  minFontSize = 10,
  maxFontSize = 20,
  children,
  ...props
}: AutoTextProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const autoText = useCallback(() => {
    const node = nodeRef.current;
    if (!node) return;

    let low = minFontSize;
    let high = maxFontSize;
    let bestFit = minFontSize;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      node.style.fontSize = `${mid}px`;

      const height = node.getBoundingClientRect().height;

      if (height <= maxHeight) {
        bestFit = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    node.style.fontSize = `${bestFit}px`;
  }, [maxHeight, minFontSize, maxFontSize]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      autoText();
    });

    if (nodeRef.current) {
      resizeObserver.observe(nodeRef.current);
    }

    // Cleanup the observer on unmount
    return () => {
      if (nodeRef.current) {
        resizeObserver.unobserve(nodeRef.current);
      }
    };
  }, [autoText]);

  useEffect(() => {
    autoText();
  }, [children, autoText]);

  return (
    <div
      ref={nodeRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflowWrap: 'break-word',
        overflowY: 'auto',
        fontSize: `${maxFontSize}px`,
        padding: '0.5rem',
        width: '100%',
        overflowX: 'hidden'
      }}
      {...props}
    >
      <p style={{ margin: 'auto', width: '100%' }}>{children}</p>
    </div>
  );
};

export default AutoText;
