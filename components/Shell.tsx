const navItems = [
  ['/', 'T\u1ed5ng quan'],
  ['/matches', 'Tr\u1eadn \u0111\u1ea5u'],
  ['/standings', 'B\u1ea3ng x\u1ebfp h\u1ea1ng'],
  ['/bracket', 'Nh\u00e1nh \u0111\u1ea5u'],
  ['/teams', '\u0110\u1ed9i tuy\u1ec3n'],
  ['/health', 'D\u1eef li\u1ec7u'],
  ['/display', 'M\u00e0n h\u00ecnh TV']
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
