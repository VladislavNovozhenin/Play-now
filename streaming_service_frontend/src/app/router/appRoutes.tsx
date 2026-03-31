import { AppLayout } from '@app/components/app-layout/AppLayout';
import { AuthPage } from '@pages/auth/AuthPage';
import { HomePage } from '@pages/home/HomePage';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const TracksPage = lazy(() => import('@pages/tracks/TracksPage').then((mod) => ({ default: mod.TracksPage })));
const PlaylistPage = lazy(() => import('@pages/playlist/PlaylistPage').then((mod) => ({ default: mod.PlaylistPage })));
const PlaylistsPage = lazy(() => import('@pages/playlists/PlaylistsPage').then((mod) => ({ default: mod.PlaylistsPage })));
const LikesSongsPage = lazy(() => import('@pages/likes-songs/LikesSongsPage').then((mod) => ({ default: mod.LikesSongsPage })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<span>Загрузка...</span>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/tracks'}
            element={
              <ProtectedRoute>
                <TracksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/playlist/:id'}
            element={
              <ProtectedRoute>
                <PlaylistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/playlists'}
            element={
              <ProtectedRoute>
                <PlaylistsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={'/favorite'}
            element={
              <ProtectedRoute>
                <LikesSongsPage />
              </ProtectedRoute>
            }
          />
          <Route path={'/auth'} element={<AuthPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
