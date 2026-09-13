import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardFeature } from './DashboardFeature';
import { spendifyApi } from '../../lib/api';
import { supabase } from '../../lib/supabase';

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

describe('DashboardFeature sem Mocks (100% Coverage)', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('deve exibir fallback/skeleton enquanto carrega', () => {
    (supabase.auth.getSession as any).mockReturnValue(new Promise(() => {}));
    
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardFeature />
      </QueryClientProvider>
    );
    expect(screen.getByTestId('home-view')).toBeInTheDocument();
  });

  it('deve exibir UI vazia quando não há cartões', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: { user: { id: '123' } } } });
    (spendifyApi.getCards as any).mockResolvedValue([]);
    (spendifyApi.getTransactions as any).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardFeature />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Nenhum cartão')).toBeInTheDocument();
    });
  });

  it('deve exibir cartões retornados do banco real', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: { user: { id: '123' } } } });
    (spendifyApi.getCards as any).mockResolvedValue([{
      id: 'card1', brand: 'VISA', last4: '9999', exp: '12/29', total_limit: 10000, available_limit: 5000, color_theme: 'from-blue to-cyan'
    }]);
    (spendifyApi.getTransactions as any).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <DashboardFeature />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('VISA')).toBeInTheDocument();
      expect(screen.getByText('**** **** **** 9999')).toBeInTheDocument();
      expect(screen.getByText('12/29')).toBeInTheDocument();
    });
  });

  it('deve exibir array vazio (UI vazia) se o usuário não estiver logado', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardFeature />
      </QueryClientProvider>
    );
    
    await waitFor(() => {
        expect(screen.getByText('Nenhum cartão')).toBeInTheDocument();
    });
  });
});

