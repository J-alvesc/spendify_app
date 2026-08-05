import type {TransactionItemProps} from "../../types/index";

export function TransactionItem({
    title,
    date,
    amount,
    icon,
    colorClass 
    }:TransactionItemProps) {

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-50">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner ${colorClass}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{date}</p>
        </div>
      </div>
      <div className="font-bold text-slate-900">
        {amount}
      </div>
    </div>
  );
}