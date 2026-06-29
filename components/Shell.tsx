import { AutoRefresh } from './AutoRefresh';

const navItems = [
  ['/', 'Tổng quan'],
  ['/matches', 'Trận đấu'],
  ['/standings', 'Bảng xếp hạng'],
  ['/bracket', 'Nhánh đấu'],
  ['/teams', 'Đội tuyển'],
  ['/health', 'Dữ liệu'],
  ['/display', 'Màn hình TV']
];

export function Shell({ children, title, subtitle, eyebrow = 'WorldCup Pulse 2026' }: { children: React.ReactNode; title: string; subtitle: string; eyebrow?: string }) {
  return (
    <main className="shell">
      <AutoRefresh />
      <header className="hero">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <nav className="nav">
          {navItems.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </header>
      {children}
    </main>
  );
}
