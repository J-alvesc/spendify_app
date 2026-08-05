import { Nfc } from "lucide-react";
import type { CreditCardProps } from "../../types/index";

export function CreditCard({
  name,
  flag,
  lastDigits,
  limit,
  colorClass,
}: CreditCardProps) {
  return (
    <div
      className={`snap-center relative shrink-0 w-[85%] sm:w-[320px] h-48 rounded-3xl p-6 flex flex-col justify-between shadow-lg ${colorClass} text-white`}
    >
      {/* Topo */}
      <div className="flex justify-between items-start">
        <Nfc className="w-6 h-6 opacity-70" />
        <span className="font-semibold text-sm tracking-wider opacity-90">
          {flag}
        </span>
      </div>

      {/* Base */}
      <div>
        <p className="text-xs opacity-70 mb-1">Limite Disponível</p>

        <h2 className="text-2xl font-bold mb-4">{limit}</h2>

        <div className="flex justify-between items-end text-sm opacity-80">
          <span>{name}</span>
          <span>**** {lastDigits}</span>
        </div>
      </div>
    </div>
  );
}
