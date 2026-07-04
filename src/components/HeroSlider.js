import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBackdrop, getPoster } from '../utils/api';
import './HeroSlider.css';

export default function HeroSlider({ items = [] }) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();
  const slides = items.slice(0, 6);

  const go = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => { setCurrent(idx); setTransitioning(false); }, 350);
  }, [transitioning]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => go((current + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [current, slides.length, go]);

  if (!slides.length) return <div className="hero hero--empty" />;

  const item = slides[current];
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const backdrop = getBackdrop(item.backdrop_path);
  const poster = getPoster(item.poster_path, 'w342');
  const genres = item.genre_ids || [];

  const handleWatch = () => navigate(`/${mediaType === 'tv' ? 'tv' : 'movie'}/${item.id}`);

  return (
    <section className="hero">
      <div className={`hero__bg ${transitioning ? 'fading' : ''}`}>
        {backdrop
          ? <img src={backdrop} alt="" aria-hidden="true" key={item.id} />
          : <div className="hero__bg-fallback" />}
        <div className="hero__bg-gradient" />
        <div className="hero__bg-vignette" />
      </div>

      <div className={`hero__content container ${transitioning ? 'fading' : ''}`}>
        <div className="hero__meta">
          <span className={`badge ${mediaType === 'tv' ? 'badge-blue' : 'badge-red'}`}>
            {mediaType === 'tv' ? 'Series' : 'Movie'}
          </span>
          {year && <span className="hero__year">{year}</span>}
          {item.vote_average > 0 && (
            <span className="hero__rating">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{color:'var(--accent-gold)'}}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              {item.vote_average.toFixed(1)}
            </span>
          )}
          <span className="hero__hd-badge">HD</span>
        </div>

        <h1 className="hero__title">{title}</h1>

        {item.overview && (
          <p className="hero__overview">
            {item.overview.slice(0, 160)}{item.overview.length > 160 ? '…' : ''}
          </p>
        )}

        <div className="hero__actions">
          <button className="hero__play-btn" onClick={handleWatch}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Play Now
          </button>
          <button className="btn btn-ghost" onClick={handleWatch}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Details
          </button>
        </div>
      </div>

      {poster && (
        <div className={`hero__poster ${transitioning ? 'fading' : ''}`}>
          <img src={poster} alt={title} />
          <div className="hero__poster-glow" />
        </div>
      )}

      <div className="hero__dots">
        {slides.map((_, i) => (
          <button key={i} className={`hero__dot ${i === current ? 'active' : ''}`} onClick={() => go(i)} />
        ))}
      </div>

      <div className="hero__progress">
        <div className="hero__progress-bar" key={current} />
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <div className="hero hero--skeleton">
      <div className="skeleton" style={{position:'absolute',inset:0,borderRadius:0}} />
      <div className="hero__content container">
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          <div className="skeleton" style={{width:70,height:22,borderRadius:99}} />
          <div className="skeleton" style={{width:40,height:22,borderRadius:99}} />
        </div>
        <div className="skeleton" style={{width:'55%',height:56,borderRadius:6,marginBottom:16}} />
        <div className="skeleton" style={{width:'70%',height:14,borderRadius:4,marginBottom:8}} />
        <div className="skeleton" style={{width:'55%',height:14,borderRadius:4,marginBottom:32}} />
        <div style={{display:'flex',gap:12}}>
          <div className="skeleton" style={{width:140,height:46,borderRadius:6}} />
          <div className="skeleton" style={{width:110,height:46,borderRadius:6}} />
        </div>
      </div>
    </div>
  );
}
