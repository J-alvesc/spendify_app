import type { CreditCardProps } from "./index";

export const meusCartoes: CreditCardProps[] = [
  {
    id: "1", // O React SEMPRE exige um ID único quando criamos listas
    name: "JORDAN",
    flag: "MASTERCARD",
    lastDigits: "1234",
    limit: "R$ 5.000,00",
    colorClass: "bg-gradient-to-br from-purple-600 to-purple-900",
  },
  {
    id: "2",
    name: "JORDAN",
    flag: "VISA",
    lastDigits: "9876",
    limit: "R$ 12.000,00",
    colorClass: "bg-gradient-to-br from-blue-900 to-blue 800 to-black",
  },
  {
    id: "3",
    name: "JORDAN",
    flag: "VISA",
    lastDigits: "9876",
    limit: "R$ 12.000,00",
    colorClass: "bg-gradient-to-br from-slate-800 to-black",
  },
  {
    id: "4",
    name: "JORDAN",
    flag: "VISA",
    lastDigits: "9876",
    limit: "R$ 12.000,00",
    colorClass: "bg-gradient-to-br from-red-600 to-red-900 800 to-black",
  },
  
];