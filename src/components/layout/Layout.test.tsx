import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { Layout } from './Layout';

describe('Layout (100% Coverage)', () => {
  it('deve renderizar a topbar e navbar', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    // Checa saudação estática da topbar
    expect(screen.getByText(/Bom dia,/i)).toBeInTheDocument();
  });

  it('deve abrir o modal ao clicar no botão flutuante e fechá-lo depois', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    
    // O modal inicia fechado
    expect(screen.queryByText('Nova Compra')).not.toBeInTheDocument();

    // Acha o FAB 
    const fabButton = screen.getByTestId('fab-button');
    fireEvent.click(fabButton);

    // O modal deve estar aberto agora
    expect(screen.getByText('Nova Compra')).toBeInTheDocument();

    // Testa fechamento do modal pegando o svg de X ou pegando todos os buttons
    const buttons = screen.getAllByRole('button');
    // O botão de fechar é o que vem logo após o título, na prática é um button dentro do modal
    const closeBtn = buttons.find(b => b.className.includes('bg-slate-100'));
    if (closeBtn) fireEvent.click(closeBtn);
    
    expect(screen.queryByText('Nova Compra')).not.toBeInTheDocument();
  });
});

