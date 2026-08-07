import { Settings, Calendar, CreditCard as CardIcon, Nfc } from "lucide-react";
import type { CreditCardProps } from "../../types";

// A interface de props pode ser estendida para incluir mais dados dinâmicos no futuro.
// Por agora, ela espera os dados de um cartão e informações adicionais.
interface CardDetailProps {
  card: CreditCardProps;
  availableLimit: string;
  closingDay: number;
  dueDay: number;
}

export function CardDetail({
  card,
  availableLimit,
  closingDay,
  dueDay,
}: CardDetailProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden mb-6 shadow-sm border border-slate-100">
      {/* O cabeçalho usa a classe de cor que vem dos dados do cartão */}
      <div
        className={`p-6 text-white flex justify-between items-center ${card.colorClass}`}
      >
        <div>
          <h3 className="text-lg font-extrabold tracking-wide m-0">
            {card.flag}
          </h3>
          <p className="text-xs opacity-80 mt-1">**** {card.lastDigits}</p>
        </div>
        <Nfc className="w-7 h-7 opacity-70" />
      </div>

      {/* Corpo do Cartão */}
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
              Limite do Cartão
            </p>
            <p className="text-lg font-extrabold text-slate-900">
              {card.limit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
              Disponível
            </p>
            <p className="text-lg font-extrabold text-emerald-600">
              {availableLimit}
            </p>
          </div>
        </div>

        {/* Caixas de Data */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
            <div className="bg-slate-200 text-slate-500 p-2 rounded-full">
              <CardIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">
                Fecha Dia
              </p>
              <p className="text-base font-extrabold text-slate-900">
                {closingDay}
              </p>
            </div>
          </div>

          <div className="flex-1 bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
            <div className="bg-slate-200 text-slate-500 p-2 rounded-full">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">
                Vence Dia
              </p>
              <p className="text-base font-extrabold text-slate-900">{dueDay}</p>
            </div>
          </div>
        </div>

        {/* Botão de Ação */}
        <button className="w-full bg-slate-50 text-slate-600 border border-slate-100 py-3.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 hover:bg-slate-100 transition-colors">
          <Settings className="w-4 h-4" />
          Configurar Cartão
        </button>
      </div>
    </div>
  );
}
