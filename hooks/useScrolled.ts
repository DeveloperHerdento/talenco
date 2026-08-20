"use client";

import { useEffect, useState } from "react";

export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}

type ScrollState = {
  scrolled: boolean;
  hidden: boolean;
};

export function useScrollVisibility(threshold = 8) {
  const [state, setState] = useState<ScrollState>({ scrolled: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const scrolled = y > threshold;
      const goingDown = y > lastY + 4;
      const goingUp = y < lastY - 4;

      setState((prev) => {
        const hidden = y > 160 && goingDown ? true : goingUp ? false : prev.hidden;
        return { scrolled, hidden: scrolled ? hidden : false };
      });

      lastY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return state;
}
