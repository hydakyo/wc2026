import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WorldCup Pulse 2026',
  description: 'B\u1ea3ng \u0111i\u1ec1u khi\u1ec3n th\u1eddi gian th\u1ef1c cho FIFA World Cup 2026'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
