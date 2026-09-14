import { describe, it, expect } from 'vitest';
import { cn, formatCurrency } from './utils';

describe('utils (100% Coverage)', () => {
  it('cn() deve mesclar as classes do Tailwind e sobrescrever conflitantes', () => {
    // Mescla simples
    expect(cn('p-4', 'mt-2')).toBe('p-4 mt-2');
    // Resolução de conflito (p-6 substitui p-4)
    expect(cn('p-4', 'p-6')).toBe('p-6');
    // Ignorar condicionais falsos
    const isHidden = false;
    expect(cn('p-4', isHidden && 'p-2', undefined, 'bg-red-500')).toBe('p-4 bg-red-500');
  });

  it('formatCurrency() deve formatar valores em Real (BRL)', () => {
    const formatted = formatCurrency(1250.5);
    // Limpando os characteres space e non-breaking space para o teste ficar consistente
    const cleanFormatted = formatted.replace(/\u00A0/g, ' ').replace(/\s/g, ' ');
    expect(cleanFormatted).toContain('R$');
    expect(cleanFormatted).toContain('1.250,50');
  });
});

