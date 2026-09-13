import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } })
    }
  }
}));

describe('Spendify App Root', () => {
  it('Deve renderizar o Layout base e a Dashboard sem quebrar', async () => {
    render(<App />);
    
    await waitFor(() => {
        expect(screen.getByText(/Bom dia,/i)).toBeInTheDocument();
        expect(screen.getByTestId('home-view')).toBeInTheDocument();
    });
  });
});

