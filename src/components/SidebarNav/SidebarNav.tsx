'use client';

import { useEffect, useState } from 'react';
import { sidebarItems } from '@/data';

import classes from './SidebarNav.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const SidebarNav = ({ toggle }: { toggle: () => void }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname?.slice(1));

  useEffect(() => {
    setActive(pathname?.slice(1) || '');
  }, [pathname]);

  const links = sidebarItems.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label.toLocaleLowerCase() === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        setActive(item.label.toLocaleLowerCase());
        toggle();
      }}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}></div>
    </nav>
  );
};
