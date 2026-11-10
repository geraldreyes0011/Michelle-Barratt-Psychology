import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import DataPage from './pages/DataPage.jsx';
import HelpfulInfoIndex from './pages/HelpfulInfoIndex.jsx';
import HelpfulInfoPage from './pages/HelpfulInfoPage.jsx';
import NotFound from './pages/NotFound.jsx';

// Same route table as the reference site. Every content page is a JSON data file
// (src/data/pages/<key>.json) rendered by DataPage; `pageKey` maps URL -> data key.
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <DataPage pageKey={() => 'home'} /> },
      { path: '/contact', element: <DataPage pageKey={() => 'contact'} /> },
      { path: '/faq', element: <DataPage pageKey={() => 'faq'} /> },
      { path: '/locations', element: <DataPage pageKey={() => 'locations'} /> },
      { path: '/online-therapy', element: <DataPage pageKey={() => 'online-therapy'} /> },
      { path: '/practitioners', element: <DataPage pageKey={() => 'practitioners'} /> },
      { path: '/topics', element: <DataPage pageKey={() => 'topics'} /> },
      { path: '/blog', element: <DataPage pageKey={() => 'blog'} /> },
      { path: '/blog/:slug', element: <DataPage pageKey={({ slug }) => `blog__${slug}`} /> },
      { path: '/helpful-info', element: <HelpfulInfoIndex /> },
      { path: '/helpful-info/:slug', element: <HelpfulInfoPage /> },
      { path: '/therapy-services', element: <DataPage pageKey={() => 'therapy-services'} /> },
      { path: '/therapy-services/:slug', element: <DataPage pageKey={({ slug }) => `therapy-services__${slug}`} /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
