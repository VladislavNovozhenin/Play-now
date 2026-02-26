import { AuthPage } from '@pages/auth/AuthPage';
import { HomePage } from '@pages/home/HomePage';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const TracksPage = lazy(() => import('@pages/tracks/TracksPage').then((mod) => ({ default: mod.TracksPage })));
const PlaylistPage = lazy(() => import('@pages/playlist/PlaylistPage').then((mod) => ({ default: mod.PlaylistPage })));
const PlaylistsPage = lazy(() => import('@pages/playlists/PlaylistsPage').then((mod) => ({ default: mod.PlaylistsPage })));
const FavoriteSongsPage = lazy(() => import('@pages/favorite-songs/FavoriteSongsPage').then((mod) => ({ default: mod.FavoriteSongsPage })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<span>Загрузка...</span>}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path={'/tracks'} element={<TracksPage />} />
        <Route path={'/playlist/:id'} element={<PlaylistPage />} />
        <Route path={'/playlists'} element={<PlaylistsPage />} />
        <Route path={'/favorite'} element={<FavoriteSongsPage />} />
        <Route path={'/auth'} element={<AuthPage />} />
      </Routes>
    </Suspense>
  );
};
