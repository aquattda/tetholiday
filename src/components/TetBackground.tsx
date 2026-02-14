'use client';

import { useEffect, useState } from 'react';

export default function TetBackground() {
  const [petals, setPetals] = useState<Array<{ left: string; duration: string; delay: string; size: string }>>([]);

  useEffect(() => {
    const generated = Array.from({ length: 25 }).map(() => ({
      left: `${Math.random() * 100}%`,
      duration: `${6 + Math.random() * 12}s`,
      delay: `${Math.random() * 8}s`,
      size: `${6 + Math.random() * 14}px`,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Cherry Blossom Petals */}
      {petals.map((petal, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: petal.left,
            animationDuration: petal.duration,
            animationDelay: petal.delay,
            width: petal.size,
            height: petal.size,
          }}
        />
      ))}

      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tet-dark/50" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-tet-dark/30 to-transparent" />
    </div>
  );
}
