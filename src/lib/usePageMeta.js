import { useEffect } from 'react';

// Document title + meta description per page (reference: route `head`).
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description ?? '';
  }, [title, description]);
}
