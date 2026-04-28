"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type AnimationMode = "fade" | "typing";

type RotatingHeadlineProps = {
  phrases: string[];
  intervalMs?: number;
  className?: string;
  mode?: AnimationMode;
};

export function RotatingHeadline({
  phrases,
  intervalMs = 3000,
  className = "",
  mode = "fade",
}: RotatingHeadlineProps) {
  const safePhrases = phrases.length ? phrases : ["Premium Transport"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const activePhrase = safePhrases[currentIndex];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safePhrases.length);
      setTypedLength(0);
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs, safePhrases.length]);

  useEffect(() => {
    if (mode !== "typing") {
      return;
    }

    if (typedLength >= activePhrase.length) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setTypedLength((prev) => prev + 1);
    }, 55);

    return () => clearTimeout(timeoutId);
  }, [activePhrase, mode, typedLength]);

  if (mode === "typing") {
    return (
      <h1 className={`rotating-headline ${className}`}>
        {activePhrase.slice(0, typedLength)}
        <span className="typing-cursor" />
      </h1>
    );
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.h1
          key={activePhrase}
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="rotating-headline"
        >
          {activePhrase}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
