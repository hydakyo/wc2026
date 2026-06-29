'use client';

import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Trận đấu', activePaths: ['/', '/matches'] },
  { href: '/standings', label: 'Phân tích', activePaths: ['/standings', '/teams'] },
  { href: '/bracket', label: 'Vòng loại trực tiếp', activePaths: ['/bracket'] }
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Điều hướng chính">
      {navItems.map((item) => {
        const active = item.activePaths.some((path) => (path === '/' ? pathname === '/' : pathname.startsWith(path)));
        return (
          <a className={active ? 'active' : ''} key={item.href} href={item.href}>
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
