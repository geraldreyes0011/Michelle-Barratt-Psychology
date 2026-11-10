import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import PageView from './PageView.jsx';
import { footerHtml } from '../data/site.js';

export default function Layout() {
  const { pathname } = useLocation();
  // Reference behaviour: every navigation starts at the top of the page.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-soft text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-plum text-white">
        <PageView html={footerHtml} />
      </footer>
    </div>
  );
}
