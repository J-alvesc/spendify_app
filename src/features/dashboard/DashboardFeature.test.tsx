import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardFeature } from './DashboardFeature';
import { spendifyApi } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { PrivacyProvider } from '../../hooks/PrivacyContext';

vi.mock('../../lib/api', () => ({
  spendifyApi: {
    getCards: vi.fn(),
    getTransactions: vi.fn(),
  }
}));

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    }
  }
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe('DashboardFeature (Visual & Filtro de Cartões)', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('deve renderizar a tela inicial com estrutura de cartões e filtros', () => {
    (supabase.auth.getSession as any).mockReturnValue(new Promise(() => {}));
    
    render(
      <QueryClientProvider client={queryClient}>
        <PrivacyProvider>
          <DashboardFeature />
        </PrivacyProvider>
      </QueryClientProvider>
    );
    expect(screen.getByTestId('home-view')).toBeInTheDocument();
    expect(screen.getByText('Todos os Cartões')).toBeInTheDocument();
  });

  it('deve exibir cartões retornados do banco real quando logado', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: { user: { id: '123' } } } });
    (spendifyApi.getCards as any).mockResolvedValue([{
      id: 'card1', brand: 'VISA', last4: '9999', exp: '12/29', total_limit: 10000, available_limit: 5000, color_theme: 'from-blue to-cyan'
    }]);
    (spendifyApi.getTransactions as any).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <PrivacyProvider>
          <DashboardFeature />
        </PrivacyProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      // Como o cartão aparece tanto no seletor de pills quanto no card, getAllByText garante encontrar
      const visaElements = screen.getAllByText('VISA');
      expect(visaElements.length).toBeGreaterThan(0);
      expect(screen.getByText('Fecha dia 5')).toBeInTheDocument();
    });
  });

  it('deve renderizar os cartões e transações enriquecidas mesmo sem banco conectado', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    
    render(
      <QueryClientProvider client={queryClient}>
        <PrivacyProvider>
          <DashboardFeature />
        </PrivacyProvider>
      </QueryClientProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Todos os Cartões')).toBeInTheDocument();
      expect(screen.getByText(/Últimas Compras/i)).toBeInTheDocument();
      expect(screen.getByText(/Radar de Assinaturas/i)).toBeInTheDocument();
    });
  });
});
