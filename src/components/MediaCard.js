import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPoster } from '../utils/api';
import { useApp } from '../context/AppContext';
import './MediaCard.css';

export default function MediaCard({ item, index = 0 }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useApp();

  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const title = item.title || item.name || 'Unknown';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const poster = getPoster(item.poster_path, 'w342');
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const fav = isFavorite(item.id, mediaType);

  const handleClick = () => navigate(`/${mediaType === 'tv' ? 'tv' : 'movie'}/${item.id}`);
  const handleFav = (e) => { e.stopPropagation(); toggleFavorite({ ...item, media_type: mediaType }); };

  return (
    <div className="media-card" onClick={handleClick} style={{ animationDelay: `${(index % 10) * 0.04}s` }}>
      <div className="media-card__poster">
        {poster
          ? <img src={poster} alt={title} loading="lazy" />
          : <div className="media-card__no-poster">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
        }
        <div className="media-card__overlay">
          <div className="media-card__play">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        {rating && (
          <div className="media-card__rating">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {rating}
          </div>
        )}
        <div className={`media-card__type ${mediaType === 'tv' ? 'tv' : 'movie'}`}>
          {mediaType === 'tv' ? 'TV' : 'FILM'}
        </div>
        <button className={`media-card__fav ${fav ? 'active' : ''}`} onClick={handleFav} aria-label="Save">
          <svg width="12" height="12" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
      <div className="media-card__info">
        <div className="media-card__title">{title}</div>
        {year && <div className="media-card__year">{year}</div>}
      </div>
    </div>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="media-card media-card--skeleton">
      <div className="media-card__poster skeleton" style={{ aspectRatio: '2/3' }} />
      <div style={{ padding: '8px 2px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="skeleton" style={{ height: 13, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 11, width: '60%', borderRadius: 4 }} />
      </div>
    </div>
  );
}
