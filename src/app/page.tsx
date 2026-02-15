'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TetBackground from '@/components/TetBackground';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <TetBackground />

      {/* Lanterns */}
      <div className="fixed top-0 left-[10%] z-10 opacity-80">
        <div className="w-2 h-16 bg-tet-gold mx-auto"></div>
        <div className="lantern scale-75 md:scale-100"></div>
      </div>
      <div className="fixed top-0 right-[10%] z-10 opacity-80">
        <div className="w-2 h-20 bg-tet-gold mx-auto"></div>
        <div className="lantern scale-75 md:scale-100" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="fixed top-0 left-[45%] z-10 opacity-60 hidden md:block">
        <div className="w-2 h-12 bg-tet-gold mx-auto"></div>
        <div className="lantern scale-50" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Main Content */}
      <div className={`relative z-20 text-center max-w-2xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Decorative top */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-tet-gold text-2xl">✦</span>
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-tet-gold"></div>
          <span className="text-3xl">🏮</span>
          <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-tet-gold"></div>
          <span className="text-tet-gold text-2xl">✦</span>
        </div>

        {/* Year badge */}
        <div className="inline-block mb-6">
          <span className="bg-gradient-to-r from-tet-red to-red-700 text-tet-gold-light px-6 py-2 rounded-full text-sm font-bold tracking-wider border border-tet-gold/30">
            🐴 TẾT BÍNH NGỌ 2026 🐴
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-3 tracking-tight">
          <span className="tet-title">AI LÀ</span>
        </h1>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tight">
          <span className="tet-title">TRIỆU PHÚ</span>
        </h1>

        {/* Subtitle */}
        <div className="mb-8">
          <p className="text-xl md:text-2xl font-light text-white drop-shadow-lg mb-2">
            ✨ Phiên Bản Tết Nguyên Đán ✨
          </p>
          <p className="text-sm text-white/95 drop-shadow-md">
            Thử thách kiến thức về phong tục, văn hóa ngày Tết Việt Nam
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
          <div className="game-card p-3 text-center">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-xs text-tet-gold font-semibold">15 câu hỏi</div>
          </div>
          <div className="game-card p-3 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs text-tet-gold font-semibold">3 trợ giúp</div>
          </div>
          <div className="game-card p-3 text-center">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-xs text-tet-gold font-semibold">200 ngàn</div>
          </div>
        </div>

        {/* Start Button */}
        <Link href="/game">
          <button className="btn-tet text-lg md:text-xl px-10 py-4 animate-glow">
            🎆 BẮT ĐẦU THỬ THÁCH 🎆
          </button>
        </Link>

        {/* Bottom decoration */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-tet-gold/30"></div>
          <span className="text-tet-cream/30 text-xs tracking-widest">CHÚC MỪNG NĂM MỚI</span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-tet-gold/30"></div>
        </div>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-tet-red via-tet-gold to-tet-red z-20"></div>
    </main>
  );
}
