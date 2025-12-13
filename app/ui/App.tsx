
import React, { Suspense, lazy, Component, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Eager load Home Page
import HomePage from '../../pages/home/ui/home-page';

// Lazy load other pages
const PlaygroundPage = lazy(() => import('../../pages/playground/ui/playground-page'));
const CartPage = lazy(() => import('../../pages/cart/ui/cart-page'));
const LocationsPage = lazy(() => import('../../pages/locations/ui/locations-page'));

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

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
          <h2 className="text-red-500 text-xl font-bold mb-4">Что-то пошло не так</h2>
          <pre className="bg-zinc-900 p-4 rounded text-xs text-gray-300 overflow-auto max-w-full">
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-white text-black rounded font-bold"
          >
            Перезагрузить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;
