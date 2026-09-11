"use client";

import { useEffect, useRef, useState } from "react";

// Filtering is instant (client-side, already-fetched data) — this is a deliberate brief
// skeleton pulse after a search/filter change purely so the result swap doesn't feel like an
// abrupt jump-cut. Not a real network wait. Shared by every admin table.
export function useLoadingPulse(ms = 350) {
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const pulse = () => {
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), ms);
  };

  return { loading, pulse };
}
