import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PageView from '../components/PageView.jsx';
import NotFound from './NotFound.jsx';
import { usePageMeta } from '../lib/usePageMeta.js';

// One lazily loaded JSON file per page: { title, description, html }.
const pages = import.meta.glob('../data/pages/*.json', { import: 'default' });
const loaderFor = (key) => pages[`../data/pages/${key}.json`];

export default function DataPage({ pageKey }) {
  const params = useParams();
  const { hash } = useLocation();
  const key = pageKey(params);
  const [page, setPage] = useState({ key: null, data: null });

  useEffect(() => {
    const load = loaderFor(key);
    if (!load) return;
    let live = true;
    load().then((data) => { if (live) setPage({ key, data }); });
    return () => { live = false; };
  }, [key]);

  const data = page.key === key ? page.data : null;
  usePageMeta(data?.title ?? 'Michelle Barratt Psychology', data?.description);

  // In-page anchors (e.g. /therapy-services#trauma-and-ptsd-therapy) once the content exists.
  useEffect(() => {
    if (!data || !hash) return;
    requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView());
  }, [data, hash]);

  if (!loaderFor(key)) return <NotFound />;
  if (!data) return <div className="page-loading" aria-busy="true" />;
  return <PageView html={data.html} />;
}
