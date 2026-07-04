import React from 'react';
import { useApp } from '../context/AppContext';
import { getTrending, getTopRatedMovies } from '../utils/api';
import useFetch from '../hooks/useFetch';
import MediaCard from '../components/MediaCard';
import MediaRow from '../components/MediaRow';
import { getPoster } from '../utils/api';
import './Dashboard.css';

const STATS = [
  { label: 'Watchlist', icon: '🎬' },
  { label: 'Reviews', icon: '⭐' },
  { label: 'Hours Watched', icon: '⏱' },
  { label: 'Genres Explored', icon: '🗂' },
];

export default function Dashboard() {
  const { favorites, language, toggleFavorite, isFavorite } = useApp();

  const { data: trending, loading: trendingLoading } = useFetch(
    () => getTrending('movie', 'week', language), [language]
  );
  const { data: topRated, loading: trLoading } = useFetch(
    () => getTopRatedMovies(1, language), [language]
  );

  const recentFavs = favorites.slice().sort((a, b) => b.savedAt - a.savedAt);

  return (
    <div className="dashboard container">
      <div className="dashboard__hero">
        <div className="dashboard__profile">
          <div className="dashboard__avatar">
            <span>CX</span>
            <div className="dashboard__avatar-ring" />
          </div>
          <div className="dashboard__profile-info">
            <h1 className="dashboard__username">XENFLIX User</h1>
            <p className="dashboard__joined">Member since 2024</p>
            <div className="dashboard__tags">
              <span className="badge badge-red">Premium</span>
              <span className="badge badge badge-gold">Verified</span>
            </div>
          </div>
        </div>

        <div className="dashboard__stats">
          {STATS.map((s, i) => (
            <div key={s.label} className="dashboard__stat">
              <span className="dashboard__stat-icon">{s.icon}</span>
              <span className="dashboard__stat-value">
                {i === 0 ? favorites.length : i === 3 ? [...new Set(favorites.map((f) => f.genre_ids?.[0]))].filter(Boolean).length : Math.floor(Math.random() * 80) + 10}
              </span>
              <span className="dashboard__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {recentFavs.length > 0 && (
        <section className="dashboard__section">
          <div className="section-header">
            <h2 className="section-title"><span>My</span> Favorites</h2>
          </div>
          <div className="grid-cards">
            {recentFavs.map((item, i) => (
              <MediaCard key={`${item.id}-${item.media_type}`} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {recentFavs.length === 0 && (
        <div className="dashboard__empty-favs">
          <div className="dashboard__empty-favs-inner">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ opacity: 0.25 }}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <p>No favorites yet. Browse movies and hit the ♥ to save them here.</p>
          </div>
        </div>
      )}

      <MediaRow
        title="Recommended For You"
        accent="✨"
        items={trending?.results || []}
        loading={trendingLoading}
        seeAllLink="/movies"
      />

      <MediaRow
        title="Critically Acclaimed"
        items={topRated?.results || []}
        loading={trLoading}
        seeAllLink="/movies"
      />
    </div>
  );
}
