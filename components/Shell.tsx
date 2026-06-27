const navItems = [
  ['/', 'Dashboard'],
  ['/matches', 'Matches'],
  ['/standings', 'Standings'],
  ['/bracket', 'Bracket'],
  ['/teams', 'Teams'],
  ['/health', 'Health'],
  ['/display', 'TV Mode']
];

export function Shell({ children, title, subtitle, eyebrow = 'WorldCup Pulse 2026' }: { children: React.ReactNode; title: string; subtitle: string; eyebrow?: string }) {
  return (
    <main className="shell">
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
