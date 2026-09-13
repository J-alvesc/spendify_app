import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
      <h2 className="text-xl font-bold mb-2">Ops! Algo deu errado.</h2>
      <p className="text-sm text-slate-500 mb-6 text-center">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold shadow-lg"
      >
        Tentar Novamente
      </button>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="invoices" element={<div className="p-6">Faturas</div>} />
              <Route path="cards" element={<div className="p-6">Cartoes</div>} />
              <Route path="people" element={<div className="p-6">Pessoas</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

