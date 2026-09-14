import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Cards } from './Cards';
import { PrivacyProvider } from '../hooks/PrivacyContext';

describe('Cards Page (Fidelidade ao Protótipo & Regras de Negócio)', () => {
  it('deve renderizar a tela de cartões com card de limite total consolidado e lista de cartões', () => {
    render(
      <MemoryRouter>
        <PrivacyProvider>
          <Cards />
        </PrivacyProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('cards-view')).toBeInTheDocument();
    expect(screen.getByText('Limite Total Disponível')).toBeInTheDocument();
    expect(screen.getAllByText('MASTERCARD').length).toBeGreaterThan(0);
    expect(screen.getAllByText('VISA INFINITE').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Novo/i })).toBeInTheDocument();
  });

  it('deve abrir o modal de configuração ao clicar em Configurar Cartão', () => {
    render(
      <MemoryRouter>
        <PrivacyProvider>
          <Cards />
        </PrivacyProvider>
      </MemoryRouter>
    );

    const configButtons = screen.getAllByText('Configurar Cartão');
    fireEvent.click(configButtons[0]);

    // O título do modal
    expect(screen.getByRole('heading', { name: 'Configurar Cartão' })).toBeInTheDocument();
    expect(screen.getByText('Apelido do Cartão')).toBeInTheDocument();
    expect(screen.getByText('Salvar Alterações')).toBeInTheDocument();
    expect(screen.getByText('Excluir Cartão')).toBeInTheDocument();

    // Fecha o modal
    const closeBtn = screen.getAllByRole('button').find(b => b.querySelector('svg.lucide-x'));
    if (closeBtn) fireEvent.click(closeBtn);
  });

  it('deve abrir o modal para cadastrar novo cartão ao clicar em Novo', () => {
    render(
      <MemoryRouter>
        <PrivacyProvider>
          <Cards />
        </PrivacyProvider>
      </MemoryRouter>
    );

    const novoBtn = screen.getByRole('button', { name: /Novo/i });
    fireEvent.click(novoBtn);

    expect(screen.getByRole('heading', { name: 'Novo Cartão' })).toBeInTheDocument();
    expect(screen.getByText('Cadastrar Cartão')).toBeInTheDocument();
  });
});
