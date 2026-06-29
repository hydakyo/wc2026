import type { Metadata } from 'next';
import './globals.css';
import './provider.css';

export const metadata: Metadata = {
  title: 'World Cup 2026',
  description: 'Bảng điều khiển lịch thi đấu, tỷ số và phân tích World Cup 2026'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
