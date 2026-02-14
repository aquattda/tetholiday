import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ai Là Triệu Phú - Phiên Bản Tết 2026',
  description: 'Trò chơi Ai Là Triệu Phú phiên bản Tết Nguyên Đán Bính Ngọ 2026. Thử thách kiến thức về Tết Việt Nam!',
  keywords: ['ai là triệu phú', 'tết', 'trò chơi', 'quiz', 'tết nguyên đán', '2026'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-tet-pattern">
        {children}
      </body>
    </html>
  );
}
