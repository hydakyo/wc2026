import '../styles/index.css';

export const metadata = {
  title: 'World Cup 2026 Dashboard',
  description: 'Theo dõi giải đấu vô địch bóng đá thế giới',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
