import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import DetailPage from './pages/DetailPage';
import SearchPage from './pages/SearchPage';
import Dashboard from './pages/Dashboard';
import GenrePage from './pages/GenrePage';
import './styles/globals.css';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

function NoAPIKey() {
  return (
    <div className="no-api-key">
      <h1>XENFLIX</h1>
      <p>API key not configured. Create a <code>.env</code> file in your project root:</p>
      <code>REACT_APP_TMDB_API_KEY=your_key_here</code>
      <p style={{fontSize:13,marginTop:8}}>Get your free key at <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" style={{color:'var(--accent-primary)'}}>themoviedb.org</a></p>
    </div>
  );
}

export default function App() {
  if (!API_KEY) return <NoAPIKey />;

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="layout">
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <Routes>
              <Route path="/"                    element={<Home />} />
              <Route path="/movies"              element={<Movies />} />
              <Route path="/series"              element={<Series />} />
              <Route path="/trending"            element={<Movies trending />} />
              <Route path="/new"                 element={<Movies newReleases />} />
              <Route path="/movie/:id"           element={<DetailPage type="movie" />} />
              <Route path="/tv/:id"              element={<DetailPage type="tv" />} />
              <Route path="/search"              element={<SearchPage />} />
              <Route path="/dashboard"           element={<Dashboard />} />
              <Route path="/genre/:id/:name"     element={<GenrePage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
