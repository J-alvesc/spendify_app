import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Layout } from './Layout';
import { PrivacyProvider } from '../../hooks/PrivacyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('Layout (100% Coverage)', () => {
  it('deve renderizar a topbar e navbar', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PrivacyProvider>
          <MemoryRouter>
            <Layout />
          </MemoryRouter>
        </PrivacyProvider>
      </QueryClientProvider>
    );
    expect(screen.getByText(/Bom dia/i)).toBeInTheDocument();
  });

  it('deve abrir o modal ao clicar no botão flutuante e fechá-lo depois', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PrivacyProvider>
          <MemoryRouter>
            <Layout />
          </MemoryRouter>
        </PrivacyProvider>
      </QueryClientProvider>
    );
    
    // O modal inicia fechado
    expect(screen.queryByText('Nova Compra')).not.toBeInTheDocument();

    // Acha o FAB 
    const fabButton = screen.getByTestId('fab-button');
    fireEvent.click(fabButton);

    // O modal deve estar aberto agora
    expect(screen.getByText('Nova Compra')).toBeInTheDocument();

    // Fecha usando o data-testid do botão de fechar
    const closeBtn = screen.getByTestId('close-modal-btn');
    fireEvent.click(closeBtn);
    
    expect(screen.queryByText('Nova Compra')).not.toBeInTheDocument();
  });
});
