import type { ReactNode } from "react";

export interface CreditCardProps {
  id: string;
  name: string;
  flag: string;
  lastDigits: string;
  limit: string;
  colorClass: string;
}

export interface SummaryCardProps {
  id: string;
  title: string;
  value: string;
  icon: ReactNode;
  isHighlighted?: boolean;
}

export interface TransactionItemProps {
  id: string;
  title: string;
  date: string;
  amount: string;
  icon: ReactNode;
  colorClass: string;
}


