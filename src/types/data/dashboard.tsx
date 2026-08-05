import { FileText, Calendar, ShoppingCart, Coffee } from "lucide-react";
import type { SummaryCardProps, TransactionItemProps } from "../index";

export const resumoMes: SummaryCardProps[] = [
  {
    id: "1",
    title: "Fatura Atual",
    value: "R$ 2.450,00",
    icon: <FileText className="w-5 h-5 text-slate-600" />,
    isHighlighted: true,
  },
  {
    id: "2",
    title: "Próximos Meses",
    value: "R$ 1.820,00",
    icon: <Calendar className="w-5 h-5 text-slate-600" />,
  },
];

export const ultimasCompras: TransactionItemProps[] = [
  {
    id: "1",
    title: "Supermercado Assaí",
    date: "Hoje, 10:45",
    amount: "R$ 450,90",
    icon: <ShoppingCart className="w-6 h-6" />,
    colorClass: "bg-blue-500",
  },
  {
    id: "2",
    title: "Starbucks",
    date: "Ontem, 16:30",
    amount: "R$ 32,50",
    icon: <Coffee className="w-6 h-6" />,
    colorClass: "bg-amber-500",
  },
];
