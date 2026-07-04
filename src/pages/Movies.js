import React, { useState } from 'react';
import MediaCard, { MediaCardSkeleton } from '../components/MediaCard';
import { useApp } from '../context/AppContext';
import {
  getPopularMovies, getTopRatedMovies, getUpcomingMovies,
  getNowPlaying, getMoviesByGenre, getTrending
} from '../utils/api';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import './BrowsePage.css';

const FILTERS_DEFAULT = [
  { label: 'Popular',     fn: (p, l) => getPopularMovies(p, l) },
  { label: 'Top Rated',   fn: (p, l) => getTopRatedMovies(p, l) },
  { label: 'Upcoming',    fn: (p, l) => getUpcomingMovies(p, l) },
  { label: 'Now Playing', fn: (p, l) => getNowPlaying(p, l) },
  { label: 'Action',      fn: (p, l) => getMoviesByGenre(28, p, l) },
  { label: 'Drama',       fn: (p, l) => getMoviesByGenre(18, p, l) },
  { label: 'Comedy',      fn: (p, l) => getMoviesByGenre(35, p, l) },
  { label: 'Horror',      fn: (p, l) => getMoviesByGenre(27, p, l) },
  { label: 'Sci-Fi',      fn: (p, l) => getMoviesByGenre(878, p, l) },
];

const FILTERS_TRENDING = [
  { label: 'Today',     fn: (p, l) => getTrending('all', 'day', l) },
  { label: 'This Week', fn: (p, l) => getTrending('all', 'week', l) },
  { label: 'Movies',    fn: (p, l) => getTrending('movie', 'week', l) },
  { label: 'TV Shows',  fn: (p, l) => getTrending('tv', 'week', l) },
];

const FILTERS_NEW = [
  { label: 'Upcoming',    fn: (p, l) => getUpcomingMovies(p, l) },
  { label: 'Now Playing', fn: (p, l) => getNowPlaying(p, l) },
];

export default function Movies({ trending, newReleases }) {
  const { language } = useApp();
  const [activeFilter, setActiveFilter] = useState(0);

  const FILTERS = trending ? FILTERS_TRENDING : newReleases ? FILTERS_NEW : FILTERS_DEFAULT;
  const pageTitle = trending ? 'Trending' : newReleases ? 'New Releases' : 'Movies';

  const { items, loading, lastItemRef } = useInfiniteScroll(
    (page, lang) => FILTERS[activeFilter].fn(page, lang),
    [language, activeFilter]
  );

  return (
    <div className="browse-page container">
      <div className="browse-page__header">
        <h1 className="browse-page__title">{pageTitle}</h1>
        <div className="filter-pills">
          {FILTERS.map((f, i) => (
            <button key={f.label}
              className={`filter-pill ${i === activeFilter ? 'active' : ''}`}
              onClick={() => setActiveFilter(i)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid-cards">
        {items.map((item, i) => (
          <div key={`${item.id}-${i}`} ref={i === items.length - 1 ? lastItemRef : null}>
            <MediaCard item={item} index={i % 20} />
          </div>
        ))}
        {loading && Array.from({ length: 12 }).map((_, i) => <MediaCardSkeleton key={`sk-${i}`} />)}
      </div>
      {!loading && items.length === 0 && (
        <div className="error-state"><p>No results found.</p></div>
      )}
    </div>
  );
}
