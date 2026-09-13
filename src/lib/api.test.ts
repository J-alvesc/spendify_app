import { describe, it, expect, vi, beforeEach } from 'vitest';
import { spendifyApi } from './api';
import { supabase } from './supabase';

vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(),
  }
}));

describe('spendifyApi (100% Coverage)', () => {
  const mockEq = vi.fn();
  const mockSelect = vi.fn();
  const mockMaybeSingle = vi.fn();
  const mockOrder = vi.fn();
  const mockLimit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.from as any).mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle, order: mockOrder });
    mockOrder.mockReturnValue({ limit: mockLimit });
  });

  describe('getProfile', () => {
    it('deve retornar dados quando a chamada for bem-sucedida', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: { id: '1' }, error: null });
      const data = await spendifyApi.getProfile('1');
      expect(data).toEqual({ id: '1' });
    });

    it('deve disparar erro quando a chamada falhar', async () => {
      mockMaybeSingle.mockResolvedValueOnce({ data: null, error: new Error('DB Error') });
      await expect(spendifyApi.getProfile('1')).rejects.toThrow('DB Error');
    });
  });

  describe('getCards', () => {
    it('deve retornar dados quando a chamada for bem-sucedida', async () => {
      mockEq.mockResolvedValueOnce({ data: [{ id: 'card1' }], error: null });
      const data = await spendifyApi.getCards('1');
      expect(data).toEqual([{ id: 'card1' }]);
    });

    it('deve disparar erro quando a chamada falhar', async () => {
      mockEq.mockResolvedValueOnce({ data: null, error: new Error('Cards Error') });
      await expect(spendifyApi.getCards('1')).rejects.toThrow('Cards Error');
    });
  });

  describe('getInsights', () => {
    it('deve retornar dados de insight quando bem-sucedido', async () => {
      mockLimit.mockResolvedValueOnce({ data: [{ id: 'insight1' }], error: null });
      const data = await spendifyApi.getInsights('1');
      expect(data).toEqual([{ id: 'insight1' }]);
    });

    it('deve disparar erro de insight quando a chamada falhar', async () => {
      mockLimit.mockResolvedValueOnce({ data: null, error: new Error('Insights Error') });
      await expect(spendifyApi.getInsights('1')).rejects.toThrow('Insights Error');
    });
  });
});

