import { TransactionItem } from "../../ui/TransactionItem";
import { ultimasCompras } from "../../../types/data/dashboard";

export function TransactionsSection() {
  return (
    <div className="flex flex-col gap-3">
      {ultimasCompras.map((compra) => (
        <TransactionItem key={compra.id} {...compra} />
      ))}
    </div>
  );
}
