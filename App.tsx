import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useShopStore } from './entities/shop/model/shop.store';
import { api } from './shared/api/client';
import { MOCK_SHOP_ID } from './shared/api/mocks/data';

// Eager load Home Page
import HomePage from './pages/home/ui/home-page';

// Lazy load other pages
const PlaygroundPage = lazy(() => import('./pages/playground/ui/playground-page'));
const CartPage = lazy(() => import('./pages/cart/ui/cart-page'));
const LocationsPage = lazy(() => import('./pages/locations/ui/locations-page'));

// Initialize Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const Layout = ({ children }: { children?: React.ReactNode }) => (
  <div className="min-h-screen bg-background text-foreground font-sans antialiased">
    {children}
  </div>
);

const AdminPage = () => (
  <Layout>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Панель администратора</h1>
      <p>Доступ ограничен.</p>
    </div>
  </Layout>
);

const App: React.FC = () => {
  const currentShopId = useShopStore((state) => state.currentShopId);

  // Sync Store ID to API Client
  useEffect(() => {
    // If no shop selected yet (first load), fallback to default mock, 
    // but don't set it in store so user can still choose later if we add a "Select Shop" landing.
    // For now, our app defaults to MOCK_SHOP_ID if logic asks for it, but let's be explicit in API.
    api.setShopId(currentShopId || MOCK_SHOP_ID);
  }, [currentShopId]);

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Suspense fallback={<div className="h-screen bg-[#09090b] flex items-center justify-center text-gray-500">Загрузка...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;