import confetti from 'canvas-confetti';

export function useConfetti() {
  const fire = (options?: confetti.Options) => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'],
      ...options,
    });
  };

  const celebrate = () => {
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3B82F6', '#8B5CF6', '#10B981'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F59E0B', '#EF4444', '#14B8A6'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  return { fire, celebrate };
}
