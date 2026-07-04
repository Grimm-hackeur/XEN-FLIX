import React, { useState, useEffect } from 'react';
import MediaCard, { MediaCardSkeleton } from '../components/MediaCard';
import { useApp } from '../context/AppContext';
import { searchMulti } from '../utils/api';
import './BrowsePage.css';
import './SearchPage.css';

export default function SearchPage() {
  const { searchQuery, language } = useApp();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!searchQuery.trim()) { setResults([]); return; }
    setLoading(true);
    setPage(1);
    searchMulti(searchQuery, 1, language)
      .then((res) => {
        setResults(res.data.results.filter((r) => r.media_type !== 'person' && r.poster_path));
        setTotalPages(res.data.total_pages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchQuery, language]);

  const loadMore = () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    searchMulti(searchQuery, nextPage, language).then((res) => {
      setResults((prev) => [...prev, ...res.data.results.filter((r) => r.media_type !== 'person' && r.poster_path)]);
      setPage(nextPage);
    });
  };

  return (
    <div className="browse-page container">
      <div className="browse-page__header">
        {searchQuery ? (
          <h1 className="browse-page__title">
            Results for <span style={{ color: 'var(--accent-primary)' }}>"{searchQuery}"</span>
          </h1>
        ) : (
          <h1 className="browse-page__title">Search</h1>
        )}
      </div>

      {!searchQuery && (
        <div className="search-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ opacity: 0.2 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>Use the search bar above to find movies & shows</p>
        </div>
      )}

      <div className="grid-cards">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <MediaCardSkeleton key={i} />)
          : results.map((item, i) => <MediaCard key={`${item.id}-${i}`} item={item} index={i} />)}
      </div>

      {!loading && results.length === 0 && searchQuery && (
        <div className="error-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>No results for "{searchQuery}"</p>
        </div>
      )}

      {results.length > 0 && page < totalPages && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn btn-ghost" onClick={loadMore}>Load More</button>
        </div>
      )}
    </div>
  );
}
