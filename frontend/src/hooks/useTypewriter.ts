import { useState, useEffect, useRef } from 'react';

export function useTypewriter(text: string, speed = 18, enabled = true) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setIsDone(true);
      return;
    }

    setDisplayed('');
    setIsDone(false);
    indexRef.current = 0;

    const type = () => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        timerRef.current = setTimeout(type, speed);
      } else {
        setIsDone(true);
      }
    };

    timerRef.current = setTimeout(type, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, enabled]);

  return { displayed, isDone };
}
