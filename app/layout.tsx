import type { Metadata } from 'next';
import './globals.css';
import './provider.css';

export const metadata: Metadata = {
  title: 'WorldCup Pulse 2026',
  description: 'Bảng điều khiển thời gian thực cho FIFA World Cup 2026'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
