import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/usePageMeta.js';

const button = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-9 px-4 py-2';

export default function NotFound() {
  usePageMeta('Page not found | Michelle Barratt Psychology', '');
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-24 text-center">
      <p className="text-6xl font-semibold tracking-tight">404</p>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => window.history.back()} className={`${button} border border-input bg-background shadow-sm`}>Go back</button>
        <Link to="/" className={`${button} bg-primary text-primary-foreground shadow`}>Start over</Link>
      </div>
    </div>
  );
}
