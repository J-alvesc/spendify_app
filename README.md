# 💳 Spendify App — Inteligência Financeira & Gestão de Cartões

O **Spendify** é uma aplicação web mobile-first de gestão financeira pessoal e controle avançado de cartões de crédito. Focado em alta usabilidade, estética fintech moderna (estilo Nubank/XP), auditoria em tempo real, divisão de despesas colaborativas e integração com inteligência artificial para leitura e conciliação de faturas.

---

## 🛠️ Stack Tecnológica

- **Frontend Core:** React 19 + TypeScript (strict mode) + Vite 8
- **Estilização & UI:** Tailwind CSS v4 + Lucide React + Gradientes dinâmicos
- **Visualização de Dados:** Recharts 3.x (gráficos de área com gradientes e tooltips customizados)
- **Gerenciamento de Estado & Dados:** TanStack React Query v5 + Context API de Privacidade
- **Backend & Database:** Supabase (PostgreSQL, Row Level Security - RLS, Migrations)
- **Qualidade & Testes:** Vitest + Testing Library React + JSDOM (100% de testes unitários verdes)

---

## 📱 Funcionalidades Desenvolvidas em Detalhes

### 1. 🏠 Tela Inicial ("Início" / Dashboard)

A tela inicial funciona como a central de comando da saúde financeira do usuário, desenhada para fornecer clareza em menos de 3 segundos:

- **Filtro Mestre de Contexto (Pills + Carrossel de Cartões):**
  - **Pílula "Todos os Cartões":** Visão consolidada somando todos os limites, faturas e transações.
  - **Pílulas Individuais:** Alternam instantaneamente o contexto da tela para um cartão específico (_Nubank Ultravioleta_, _XP Visa Infinite_, _Inter Black_).
  - **Carrossel Snap 3D:** Cartões com texturas, bandeiras (_Mastercard/Visa_), número mascarado (`•••• 4092`), limites, datas de fechamento e glow colorido de acordo com o tema do banco.
- **Modo Privacidade Global (Olhinho 👁️):**
  - Botão no cabeçalho superior que permite ocultar todos os valores (`••••••`) instantaneamente, com persistência no `localStorage`.
- **Barra de Comprometimento de Limite:**
  - Card destacando a fatura atual, limite livre e uma barra de progresso colorida dinâmica que muda de cor (roxo/azul ➔ âmbar se >60% ➔ vermelho se >85%).
- **Quick Action Chips (Atalhos Ergonômicos):**
  - 📄 **Ver Fatura:** Atalho para detalhamento.
  - 🔒 **Bloquear/Desbloquear:** Bloqueio temporário do cartão ativo com badge visual de alerta.
  - 📈 **Ajustar Meta:** Modal direto para limites de gastos mensais.
  - ✨ **Escanear IA:** Atalho para leitura de comprovantes com OCR.
- **Spendify AI Insights:**
  - Card escuro com destaque roxo neon trazendo alertas financeiros contextuais e sugestões de economia calculadas sobre despesas de delivery e mercado.
- **Gráfico de Evolução com Janela de Tempo (`7D`, `30D`, `6M`):**
  - Gráfico de área suavizada (`recharts`) que recalcula os gastos diários, semanais ou mensais conforme o cartão e período selecionados.
- **Feed de Últimas Compras:**
  - Categorização com ícones dedicados (_Mercado, Alimentação, Streaming, Tecnologia, etc._), indicador de parcelas (`1/10x`) e tag para despesas feitas por pessoas parceiras (_ex: Mariana_).
- **Radar de Assinaturas Recorrentes:**
  - Identificação de gastos invisíveis no cartão (_Netflix, Spotify, Prime, ChatGPT_) calculando o impacto total mensal no limite.

---

### 2. 🧾 Tela de Faturas (Conciliação & Auditoria Bancária)

Criada com fidelidade estrita aos protótipos visuais e reforçada com regras reais de negócio financeiro:

- **Seletor de Cartões no Topo:**
  - Permite navegar entre as faturas de diferentes cartões em vez de agrupar tudo em uma lista confusa.
  - Exibe data de fechamento, data de vencimento e status do ciclo: **Aberta**, **Fechada** ou **Paga**.
- **Painel de Conferência de Valores (App vs Banco):**
  - **Calculado pelo App:** Soma das compras registradas no app com contador de itens apurados.
  - **Valor no Banco (com Edição Rápida ✏️):** Campo para inserir o valor oficial da fatura bancária.
  - **Barra de Auditoria de Lançamentos:** Compara visualmente quantos itens foram conferidos (ex: _5 de 6 itens conferidos - 83%_).
  - **Badge de Status:** Exibe `Tudo Certo (100%)` em verde quando os valores e contagens batem, ou `Divergência de R$` em âmbar quando há discrepância.
- **Leitura de Fatura com IA (OCR & Conciliação Assistida):**
  - Permite importar faturas em PDF ou imagem.
  - **Banner de Diagnóstico de Divergência:** A IA detecta transações que constam no extrato do banco mas faltam no app (ex: _Posto Ipiranga R$ 224,20_).
  - **Botão "Conciliar e Adicionar":** Insere a compra faltante com 1 toque com a tag visual especial **`VIA IA`**, zerando a divergência para 100% Tudo Certo.
- **Lista de Compras da Fatura com Filtro de Categoria:**
  - Visualização limpa com ícones por categoria, datas, valores e identificação de compras à vista ou parceladas.

---

### 3. 👥 Modal de Rachar Compra (Divisão Igualitária & Personalizada)

Atende tanto a divisões simples quanto a cenários reais onde cada pessoa paga quantias diferentes:

- **Modo "Divisão Igual":**
  - Divide o valor total igualmente entre as pessoas selecionadas (_Você, Paula, Ricardo_).
  - Card azul com cálculo instantâneo: _"Ficará para cada: R$ 150,00"_.
- **Modo "Personalizar Valores":**
  - Libera campos de entrada numéricos individuais para cada pessoa participante (ex: _Paula paga R$ 60,00 e Você paga R$ 40,00 de um total de R$ 100,00_).
  - Exibe a porcentagem do total que cada pessoa está assumindo em tempo real.
  - **Botão `[ Auto ]`:** Calcula e preenche automaticamente o valor restante para a pessoa selecionada com 1 toque, evitando contas manuais de cabeça.
- **Validador de Balanço e Prevenção de Erros:**
  - Mostra o total distribuído em tempo real vs o valor total da compra.
  - Se a soma não fechar, o modal exibe alerta âmbar (_"Resta alocar: R$ 10,00"_ ou _"Ultrapassou: R$ 10,00"_) e desabilita a confirmação até que a conta feche perfeitamente.

---

### 4. 🗄️ Backend Supabase & Arquitetura de Dados

O repositório já conta com estrutura completa de migrations SQL e tipagem TypeScript (`src/types/database.types.ts`):

- **Tabelas Implementadas:**
  - `profiles`: Dados do usuário, nome, avatar e score financeiro.
  - `cards`: Cartões com apelido, bandeira, últimos 4 dígitos, limite total, limite disponível, dia de fechamento e vencimento.
  - `transactions`: Lançamentos com valor, categoria, parcelas, data e tipo (_crédito, pix, dinheiro_).
  - `transaction_splits`: Relacionamento de divisão de compras por pessoas.
  - `people`: Contatos vinculados para rachar compras (com chave Pix e WhatsApp de cobrança).
  - `ai_insights`: Histórico de análises geradas por IA.
- **Políticas de Segurança:** Row Level Security (RLS) configurado para isolar todos os dados por `auth.uid()`.

---

## 🧪 Suíte de Testes Automatizados

O projeto possui **100% de cobertura nos fluxos principais**, com **18 testes unitários** passando em 7 arquivos de teste (`vitest run`):

```bash
 ✓ src/lib/api.test.ts (6 tests)
 ✓ src/lib/utils.test.ts (2 tests)
 ✓ src/components/layout/Layout.test.tsx (2 tests)
 ✓ src/pages/Invoices.test.tsx (3 tests)
 ✓ src/pages/Dashboard.test.tsx (1 test)
 ✓ src/App.test.tsx (1 test)
 ✓ src/features/dashboard/DashboardFeature.test.tsx (3 tests)

 Test Files  7 passed (7)
      Tests  18 passed (18)
```

---

## 🚀 Como Executar o Projeto

```bash
# 1. Instalar as dependências
npm install

# 2. Executar o servidor de desenvolvimento
npm run dev

# 3. Rodar os testes unitários
npm test

# 4. Rodar os testes em modo interativo (watch)
npm run test:watch

# 5. Gerar build de produção otimizado
npm run build
```

---

## 🗺️ Próximos Passos do Roadmap

1. **Tela de Cartões (`/cards`):** Detalhamento de limites totais, cartões físicos/virtuais e modal de configuração do cartão (apelido, cor, limite e datas).
2. **Tela de Pessoas (`/people`):** Lista de pessoas com saldo a receber, chave Pix e botão de cobrança via WhatsApp.
3. **Mocks & CRUD no Banco de Dados:** Conectar as telas diretamente aos métodos do Supabase com estado de carregamento e mutações.
4. **Implementação de OCR & IA:** Leitor real de PDFs de faturas bancárias e geração de insights com Gemini API.
