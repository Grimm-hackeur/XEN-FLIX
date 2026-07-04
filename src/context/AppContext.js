import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('cx_lang') || 'en-US');
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cx_favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('cx_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cx_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((item) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id && f.media_type === item.media_type);
      if (exists) return prev.filter((f) => !(f.id === item.id && f.media_type === item.media_type));
      return [...prev, { ...item, savedAt: Date.now() }];
    });
  }, []);

  const isFavorite = useCallback(
    (id, media_type) => favorites.some((f) => f.id === id && f.media_type === media_type),
    [favorites]
  );

  const langCode = language === 'fr-FR' ? 'fr' : 'en';

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        langCode,
        favorites,
        toggleFavorite,
        isFavorite,
        sidebarOpen,
        setSidebarOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
