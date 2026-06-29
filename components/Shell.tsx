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
        <div className="brand-block">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <NavLinks />
      </header>
      {children}
    </main>
  );
}
