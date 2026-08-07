interface TotalLimitCardProps {
  availableLimit: string;
  usedAmount: string;
  totalAmount: string;
  percentageUsed: number;
}

export function TotalLimitCard({
  availableLimit,
  usedAmount,
  totalAmount,
  percentageUsed,
}: TotalLimitCardProps) {
  return (
    <div className="bg-[#161c28] text-white rounded-3xl p-6 mb-6 shadow-lg">
      <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
        Limite Total Disponível
      </h3>
      <h2 className="text-3xl font-bold mb-6">{availableLimit}</h2>

      {/* Barra de Progresso */}
      <div className="w-full h-2 bg-slate-800 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-emerald-400 rounded-full"
          style={{ width: `${percentageUsed}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-xs text-slate-400 font-medium">
        <span>{usedAmount} usados</span>
        <span>Total: {totalAmount}</span>
      </div>
    </div>
  );
}
