import { AutoRefresh } from './AutoRefresh';
import { NavLinks } from './NavLinks';

export function Shell({
  children,
  title,
  subtitle,
  eyebrow = 'World Cup 2026'
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  eyebrow?: string;
}) {
  return (
    <main className="shell">
      <AutoRefresh />
      <header className="site-header">
        <div className="header-topline">
          <div className="brand-block">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
          </div>
          <NavLinks />
        </div>
        <p>{subtitle}</p>
      </header>
      {children}
    </main>
  );
}
