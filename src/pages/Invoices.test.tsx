import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Invoices } from "./Invoices";
import { PrivacyProvider } from "../hooks/PrivacyContext";

describe("Invoices Page (Fidelidade ao Protótipo & Regras de Negócio)", () => {
  it("deve renderizar a tela de faturas com seletor de cartões, conferência de valores e botão de IA", () => {
    render(
      <PrivacyProvider>
        <Invoices />
      </PrivacyProvider>,
    );

    expect(screen.getByTestId("invoices-view")).toBeInTheDocument();
    expect(screen.getByText("Nubank Ultravioleta")).toBeInTheDocument();
    expect(screen.getByText("XP Visa Infinite")).toBeInTheDocument();
    expect(screen.getByText(/Fatura de Julho/i)).toBeInTheDocument();
    expect(screen.getByText("Conferência de Valores")).toBeInTheDocument();
    expect(screen.getByText(/Ler fatura com IA/i)).toBeInTheDocument();
    expect(screen.getByText("Supermercado Extra")).toBeInTheDocument();
    expect(screen.getByText("Amazon - Monitor")).toBeInTheDocument();
  });

  it("deve permitir trocar de cartão e atualizar o contexto da fatura", () => {
    render(
      <PrivacyProvider>
        <Invoices />
      </PrivacyProvider>,
    );

    const xpButton = screen.getByText("XP Visa Infinite");
    fireEvent.click(xpButton);

    expect(screen.getByText("Apple Store - Acessórios")).toBeInTheDocument();
  });

  it("deve abrir o modal de rachar compra com opção de divisão igual e personalizada", () => {
    render(
      <PrivacyProvider>
        <Invoices />
      </PrivacyProvider>,
    );

    const racharButtons = screen.getAllByText(/Rachar/i);
    fireEvent.click(racharButtons[0]);

    expect(screen.getByText("Rachar Compra")).toBeInTheDocument();
    expect(screen.getByText("Divisão Igual")).toBeInTheDocument();
    expect(screen.getByText("Personalizar Valores")).toBeInTheDocument();
    expect(screen.getByText("Paula")).toBeInTheDocument();
    expect(screen.getByText("Ricardo")).toBeInTheDocument();

    // Alterna para o modo Personalizar Valores
    fireEvent.click(screen.getByText("Personalizar Valores"));
    expect(screen.getByText(/Defina o valor de cada um/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Distribuído/i)).toBeInTheDocument();

    // Confirma divisão com saldo balanceado
    fireEvent.click(screen.getByText("Confirmar Divisão"));
    expect(screen.queryByText("Rachar Compra")).not.toBeInTheDocument();
  });
});
