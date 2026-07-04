import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MediaCard, { MediaCardSkeleton } from '../components/MediaCard';
import { useApp } from '../context/AppContext';
import { getMoviesByGenre, getSeriesByGenre } from '../utils/api';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import './BrowsePage.css';

export default function GenrePage() {
  const { id, name } = useParams();
  const { language } = useApp();
  const [mediaType, setMediaType] = useState('movie');

  const { items, loading, lastItemRef } = useInfiniteScroll(
    (page, lang) => mediaType === 'movie'
      ? getMoviesByGenre(id, page, lang)
      : getSeriesByGenre(id, page, lang),
    [language, mediaType, id]
  );

  return (
    <div className="browse-page container">
      <div className="browse-page__header">
        <h1 className="browse-page__title">{decodeURIComponent(name)}</h1>
        <div className="filter-pills">
          <button className={`filter-pill ${mediaType === 'movie' ? 'active' : ''}`} onClick={() => setMediaType('movie')}>🎬 Movies</button>
          <button className={`filter-pill ${mediaType === 'tv' ? 'active' : ''}`} onClick={() => setMediaType('tv')}>📺 Series</button>
        </div>
      </div>
      <div className="grid-cards">
        {items.map((item, i) => (
          <div key={`${item.id}-${i}`} ref={i === items.length - 1 ? lastItemRef : null}>
            <MediaCard item={{ ...item, media_type: mediaType }} index={i % 20} />
          </div>
        ))}
        {loading && Array.from({ length: 12 }).map((_, i) => <MediaCardSkeleton key={i} />)}
      </div>
      {!loading && items.length === 0 && <div className="error-state"><p>No results found.</p></div>}
    </div>
  );
}
