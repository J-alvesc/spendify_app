import { useState, useEffect } from "react";
import { X, Trash2, CreditCard, Calendar, Nfc, AlertTriangle } from "lucide-react";
import type { MockCard } from "../../data/spendifyMocks";

interface CardConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: MockCard | null; // se null, é criação de novo cartão
  onSave: (updatedCard: MockCard) => void;
  onDelete?: (cardId: string) => void;
}

export const COLOR_THEMES = [
  {
    id: "purple",
    name: "Roxo",
    bgClass: "bg-[#820AD1]",
    gradientClass: "from-[#820AD1] via-[#61079e] to-[#3a0261]",
    glow: "rgba(130, 10, 209, 0.4)",
  },
  {
    id: "black",
    name: "Preto Black",
    bgClass: "bg-slate-900",
    gradientClass: "from-slate-950 via-slate-900 to-zinc-900",
    glow: "rgba(15, 23, 42, 0.4)",
  },
  {
    id: "blue",
    name: "Azul",
    bgClass: "bg-blue-600",
    gradientClass: "from-blue-700 via-blue-800 to-indigo-950",
    glow: "rgba(37, 99, 235, 0.4)",
  },
  {
    id: "emerald",
    name: "Verde",
    bgClass: "bg-emerald-600",
    gradientClass: "from-emerald-700 via-teal-800 to-slate-900",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  {
    id: "orange",
    name: "Laranja",
    bgClass: "bg-orange-500",
    gradientClass: "from-amber-600 via-orange-600 to-amber-900",
    glow: "rgba(234, 88, 12, 0.4)",
  },
];

export function CardConfigModal({
  isOpen,
  onClose,
  card,
  onSave,
  onDelete,
}: CardConfigModalProps) {
  const [name, setName] = useState("");
  const [totalLimit, setTotalLimit] = useState("");
  const [closingDay, setClosingDay] = useState("05");
  const [dueDay, setDueDay] = useState("12");
  const [selectedColorId, setSelectedColorId] = useState("purple");
  const [last4, setLast4] = useState("1234");
  const [brand, setBrand] = useState("MASTERCARD");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (card) {
      setName(card.name || card.bank_name || "MASTERCARD");
      setTotalLimit(card.total_limit ? card.total_limit.toString() : "5000");
      setClosingDay(
        card.closing_day ? card.closing_day.toString().padStart(2, "0") : "05"
      );
      setDueDay(card.due_day ? card.due_day.toString().padStart(2, "0") : "12");
      setLast4(card.last4 || "1234");
      setBrand(card.brand || "MASTERCARD");

      const foundColor = COLOR_THEMES.find(
        (c) => card.color_theme && card.color_theme.includes(c.gradientClass)
      );
      if (foundColor) {
        setSelectedColorId(foundColor.id);
      } else {
        setSelectedColorId("purple");
      }
    } else {
      setName("NOVO CARTÃO");
      setTotalLimit("5000");
      setClosingDay("05");
      setDueDay("12");
      setSelectedColorId("purple");
      setLast4("1234");
      setBrand("MASTERCARD");
    }
    setShowDeleteConfirm(false);
  }, [card, isOpen]);

  if (!isOpen) return null;

  const currentTheme =
    COLOR_THEMES.find((c) => c.id === selectedColorId) || COLOR_THEMES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum =
      parseFloat(totalLimit.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;

    const updated: MockCard = {
      id: card ? card.id : `card-${Date.now()}`,
      name: name.toUpperCase(),
      bank_name: name,
      brand: brand.toUpperCase(),
      last4: last4.replace(/\D/g, "").slice(-4) || "1234",
      total_limit: limitNum,
      available_limit: card
        ? Math.min(card.available_limit, limitNum)
        : limitNum * 0.75,
      closing_day: parseInt(closingDay, 10) || 5,
      due_day: parseInt(dueDay, 10) || 12,
      color_theme: currentTheme.gradientClass,
      accent_glow: currentTheme.glow,
    };

    onSave(updated);
    onClose();
  };

  const handleConfirmDelete = () => {
    if (card && onDelete) {
      onDelete(card.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop com blur */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container Mobile First */}
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-lg p-6 pb-8 relative z-10 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Pílula de arrasto mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {card ? "Configurar Cartão" : "Novo Cartão"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Humanizado do Cartão */}
        <div className="mb-6">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Pré-visualização em tempo real
          </p>
          <div
            className={`rounded-2xl p-5 text-white shadow-lg bg-gradient-to-r ${currentTheme.gradientClass} relative overflow-hidden transition-all duration-300`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-75">
                  {brand}
                </span>
                <h4 className="text-base font-black tracking-wide truncate max-w-[200px]">
                  {name || "NOME DO CARTÃO"}
                </h4>
              </div>
              <Nfc className="w-6 h-6 opacity-80" />
            </div>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 block">
                  Últimos dígitos
                </span>
                <span className="font-mono text-sm font-bold tracking-widest">
                  •••• {last4 || "0000"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-70 block">
                  Fecha dia / Vence dia
                </span>
                <span className="text-xs font-bold font-mono">
                  {closingDay.padStart(2, "0")} / {dueDay.padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Apelido do Cartão */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Apelido do Cartão
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all">
              <CreditCard className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: MASTERCARD NUBANK"
                required
                className="w-full bg-transparent text-sm font-extrabold text-slate-900 outline-none uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Bandeira & Últimos 4 Dígitos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Bandeira
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-extrabold text-slate-900 outline-none focus:border-slate-800 transition-all cursor-pointer"
              >
                <option value="MASTERCARD">MASTERCARD</option>
                <option value="VISA">VISA</option>
                <option value="ELO">ELO</option>
                <option value="AMEX">AMEX</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Últimos 4 Dígitos
              </label>
              <input
                type="text"
                maxLength={4}
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, ""))}
                placeholder="1234"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-extrabold text-slate-900 outline-none focus:border-slate-800 transition-all text-center tracking-widest font-mono"
              />
            </div>
          </div>

          {/* Limite Total */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Limite Total (R$)
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all">
              <span className="text-sm font-black text-slate-400 mr-2">R$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={totalLimit}
                onChange={(e) => setTotalLimit(e.target.value)}
                placeholder="5000,00"
                required
                className="w-full bg-transparent text-lg font-black text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Fechamento e Vencimento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Fechamento
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5">
                <span className="text-xs font-bold text-slate-400 mr-1.5">Dia</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={closingDay}
                  onChange={(e) => setClosingDay(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-black text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Vencimento
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5">
                <span className="text-xs font-bold text-slate-400 mr-1.5">Dia</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-black text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Seletor de Cores do Cartão (IDÊNTICO AO PROTÓTIPO) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Cor do Cartão
            </label>
            <div className="flex items-center gap-3">
              {COLOR_THEMES.map((theme) => {
                const isSelected = selectedColorId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedColorId(theme.id)}
                    className={`w-11 h-11 rounded-full ${theme.bgClass} transition-all duration-200 cursor-pointer relative ${
                      isSelected
                        ? "ring-4 ring-offset-2 ring-slate-800 scale-110 shadow-md"
                        : "opacity-75 hover:opacity-100 hover:scale-105"
                    }`}
                    title={theme.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Área de Exclusão Segura */}
          {card && onDelete && (
            <div className="pt-2">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Excluir Cartão
                </button>
              ) : (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-red-800 text-xs font-bold mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Deseja realmente excluir este cartão?</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      Sim, Excluir
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botão Principal Salvar Alterações */}
          <button
            type="submit"
            className="w-full py-4 bg-slate-950 hover:bg-slate-800 active:scale-98 text-white rounded-2xl font-black text-sm tracking-wide shadow-xl shadow-slate-950/20 transition-all cursor-pointer flex items-center justify-center mt-2"
          >
            {card ? "Salvar Alterações" : "Cadastrar Cartão"}
          </button>
        </form>
      </div>
    </div>
  );
}
