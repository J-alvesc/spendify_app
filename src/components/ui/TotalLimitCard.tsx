import { usePrivacyContext } from "../../hooks/PrivacyContext";
import { formatCurrency } from "../../lib/utils";

interface TotalLimitCardProps {
  availableLimit: number;
  usedAmount: number;
  totalAmount: number;
  percentageUsed: number;
}

export function TotalLimitCard({
  availableLimit,
  usedAmount,
  totalAmount,
  percentageUsed,
}: TotalLimitCardProps) {
  const { formatPrivate } = usePrivacyContext();

  return (
    <div className="bg-[#121824] text-white rounded-[2rem] p-6 mb-6 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Glow sutil */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
        Limite Total Disponível
      </h3>
      <h2 className="text-3xl font-black mb-6 tracking-tight">
        {formatPrivate(availableLimit, formatCurrency)}
      </h2>

      {/* Barra de Progresso do Protótipo */}
      <div className="w-full h-2.5 bg-slate-800/80 rounded-full mb-3 overflow-hidden p-0.5">
        <div
          className="h-full bg-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-400/30"
          style={{ width: `${Math.max(2, Math.min(100, percentageUsed))}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-400 font-bold">
        <span>{formatPrivate(usedAmount, formatCurrency)} usados</span>
        <span>Total: {formatPrivate(totalAmount, formatCurrency)}</span>
      </div>
    </div>
  );
}
