"use client";

import { useEffect, useRef, useState } from "react";

type MapEmbedProps = {
  src: string;
  title: string;
  className?: string;
};

const MIN_RENDER_WIDTH = 640;

export function MapEmbed({ src, title, className }: MapEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const renderWidth = Math.max(box.width, MIN_RENDER_WIDTH);
  const scale = box.width > 0 ? box.width / renderWidth : 1;
  const renderHeight = box.height > 0 ? box.height / scale : 0;

  return (
    <div ref={containerRef} className={className}>
      {box.width > 0 && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0"
          style={{
            width: renderWidth,
            height: renderHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      )}
    </div>
  );
}
