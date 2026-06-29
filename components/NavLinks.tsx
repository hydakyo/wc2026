'use client';

import { usePathname } from 'next/navigation';

const navItems = [
  ['/', 'Tổng quan'],
  ['/matches', 'Trận đấu'],
  ['/standings', 'Phân tích'],
  ['/bracket', 'Vòng loại trực tiếp']
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Điều hướng chính">
      {navItems.map(([href, label]) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <a className={active ? 'active' : ''} key={href} href={href}>
            {label}
          </a>
        );
      })}
    </nav>
  );
}
