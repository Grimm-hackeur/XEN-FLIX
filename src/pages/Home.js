import React from 'react';
import HeroSlider, { HeroSkeleton } from '../components/HeroSlider';
import MediaRow from '../components/MediaRow';
import { useApp } from '../context/AppContext';
import {
  getTrending, getPopularMovies, getPopularSeries,
  getTopRatedMovies, getNowPlaying, getUpcomingMovies,
} from '../utils/api';
import useFetch from '../hooks/useFetch';

export default function Home() {
  const { language } = useApp();

  const { data: trending,      loading: tl } = useFetch(() => getTrending('all', 'week', language),      [language]);
  const { data: nowPlaying,    loading: nl } = useFetch(() => getNowPlaying(1, language),                [language]);
  const { data: popularMovies, loading: pml } = useFetch(() => getPopularMovies(1, language),            [language]);
  const { data: popularSeries, loading: psl } = useFetch(() => getPopularSeries(1, language),            [language]);
  const { data: topRated,      loading: trl } = useFetch(() => getTopRatedMovies(1, language),           [language]);
  const { data: upcoming,      loading: ul }  = useFetch(() => getUpcomingMovies(1, language),            [language]);

  const heroItems = (trending?.results || []).filter(i => i.backdrop_path).slice(0, 6);
  const trendingItems = trending?.results || [];

  return (
    <div className="page-enter">
      {tl ? <HeroSkeleton /> : <HeroSlider items={heroItems} />}

      <div style={{ padding: '40px 0 0' }}>
        <div className="container">
          {/* Top 10 */}
          <MediaRow
            title="Top 10 Today"
            accent="🔟"
            items={trendingItems.slice(0, 10)}
            loading={tl}
            seeAllLink="/movies"
            showRank
          />
          <MediaRow
            title="Now Playing"
            accent="🎬"
            items={nowPlaying?.results || []}
            loading={nl}
            seeAllLink="/movies"
          />
          <MediaRow
            title="Trending This Week"
            accent="🔥"
            items={trendingItems}
            loading={tl}
            seeAllLink="/movies"
          />
          <MediaRow
            title="Popular Movies"
            items={popularMovies?.results || []}
            loading={pml}
            seeAllLink="/movies"
          />
          <MediaRow
            title="Popular Series"
            items={(popularSeries?.results || []).map(i => ({ ...i, media_type: 'tv' }))}
            loading={psl}
            seeAllLink="/series"
          />
          <MediaRow
            title="Top Rated"
            accent="⭐"
            items={topRated?.results || []}
            loading={trl}
            seeAllLink="/movies"
          />
          <MediaRow
            title="Coming Soon"
            accent="🗓️"
            items={upcoming?.results || []}
            loading={ul}
            seeAllLink="/movies"
          />
        </div>
      </div>
    </div>
  );
}
