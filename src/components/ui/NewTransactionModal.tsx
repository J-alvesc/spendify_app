import React, { useState } from 'react';
import { X, Users, CreditCard, Wallet, Smartphone, Calendar, Tag, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { spendifyApi } from '../../lib/api';
import { supabase } from '../../lib/supabase';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTransactionModal({ isOpen, onClose }: ModalProps) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'credit' | 'pix' | 'cash'>('credit');
  const [cardId, setCardId] = useState('');
  const [installments, setInstallments] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Alimentação');

  // Fetch user's cards
  const { data: cards = [] } = useQuery({
    queryKey: ['dashboard-cards'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      return await spendifyApi.getCards(session.user.id);
    },
    enabled: isOpen,
  });

  const createTxMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Não logado");
      
      const numAmount = parseFloat(amount.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (isNaN(numAmount) || numAmount <= 0) throw new Error("Valor inválido");

      await spendifyApi.createTransaction({
        user_id: session.user.id,
        amount: numAmount,
        description,
        type,
        card_id: type === 'credit' ? (cardId || cards[0]?.id || null) : null,
        installments: parseInt(installments),
        date,
        category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-cards'] });
      resetAndClose();
    }
  });

  const resetAndClose = () => {
    setAmount('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 fade-in">
      <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl relative slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2 sticky top-0 bg-white z-10 rounded-t-3xl">
          <h2 className="text-xl font-bold text-slate-800">Nova Compra</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col gap-6">
          {/* Valor */}
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qual o valor?</span>
            <div className="flex items-center justify-center text-slate-300">
              <span className="text-3xl font-semibold mr-2 mt-2">R$</span>
              <input 
                type="text"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-5xl font-bold bg-transparent outline-none w-full max-w-[200px] text-center text-slate-800 placeholder-slate-300"
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Descrição */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Descrição</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 focus-within:border-slate-800 transition-colors">
                <FileText className="w-5 h-5 text-slate-400 mr-2" />
                <input 
                  type="text" 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Ifood, Netflix, Mercado..." 
                  className="bg-transparent w-full outline-none text-slate-800 text-sm"
                />
              </div>
            </div>

            {/* Tipo */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Forma de Pagamento</label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setType('credit')} className={`py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-all ${type === 'credit' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <CreditCard className="w-4 h-4" /> Cartão
                </button>
                <button onClick={() => setType('pix')} className={`py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-all ${type === 'pix' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Smartphone className="w-4 h-4" /> Pix
                </button>
                <button onClick={() => setType('cash')} className={`py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-all ${type === 'cash' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Wallet className="w-4 h-4" /> Dinheiro
                </button>
              </div>
            </div>

            {/* Cartão e Parcelas (Grid) */}
            {type === 'credit' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Cartão</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3">
                    <select value={cardId} onChange={e => setCardId(e.target.value)} className="bg-transparent w-full outline-none text-slate-800 text-sm">
                      <option value="" disabled>Selecione</option>
                      {cards.map(c => (
                        <option key={c.id} value={c.id}>{c.name || c.brand} ({c.last4})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Parcelas</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3">
                    <select value={installments} onChange={e => setInstallments(e.target.value)} className="bg-transparent w-full outline-none text-slate-800 text-sm">
                      <option value="1">À vista (1x)</option>
                      {[2,3,4,5,6,7,8,9,10,11,12].map(n => (
                        <option key={n} value={n}>{n}x</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Data e Categoria */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Data</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-3">
                  <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-transparent w-full outline-none text-slate-800 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Categoria</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-3">
                  <Tag className="w-4 h-4 text-slate-400 mr-2" />
                  <select value={category} onChange={e => setCategory(e.target.value)} className="bg-transparent w-full outline-none text-slate-800 text-sm">
                    <option>Alimentação</option>
                    <option>Transporte</option>
                    <option>Lazer</option>
                    <option>Educação</option>
                    <option>Saúde</option>
                    <option>Outros</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vai rachar com alguém? */}
            <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-slate-700 transition-colors">
              <Users className="w-4 h-4" /> Vai rachar com alguém?
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 sticky bottom-0 bg-white border-t border-slate-50">
          <button 
            disabled={createTxMutation.isPending || !amount}
            onClick={() => createTxMutation.mutate()}
            className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg disabled:opacity-50"
          >
            {createTxMutation.isPending ? 'Salvando...' : 'Adicionar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
}

