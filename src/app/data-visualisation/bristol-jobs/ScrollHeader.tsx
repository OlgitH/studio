'use client';

import { useEffect, useState } from 'react';
import BackHomeLink from '../../components/BackHomeLink';

export default function ScrollHeader({ title }: { title: string }) {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsFixed(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Static header — always in document flow */}
      <header className="px-6 pt-4 pb-6 md:px-8">
        <BackHomeLink />
        <h1 className="mt-6 text-2xl font-bold md:text-3xl">{title}</h1>
      </header>

      {/* Fixed header — slides in on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 pr-16 bg-[var(--page-background)] transition-transform duration-200 xl:pr-20 ${
          isFixed ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <BackHomeLink />
        <span className="truncate text-sm font-semibold">{title}</span>
      </header>
    </>
  );
}
