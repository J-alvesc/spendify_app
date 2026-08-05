💳 Spendify

Um aplicativo de gestão financeira moderno, focado em facilidade de uso, divisão de despesas e interface Mobile-First.

📖 Sobre o Projeto

O Spendify nasceu da necessidade de simplificar a gestão de cartões de crédito e a divisão de despesas entre amigos e familiares. Diferente de dashboards financeiros complexos, o Spendify adota uma abordagem Mobile-First, priorizando a ergonomia do usuário através de uma Bottom Navigation Bar (Barra de navegação inferior) e interações fluídas inspiradas nos melhores apps financeiros do mercado.

✨ Funcionalidades (Atuais e Planejadas)

[x] Arquitetura Base: Setup limpo com React, Vite e TypeScript.

[x] UI/UX Mobile-First: Barra de navegação inferior ergonômica.

[x] Gestão Visual de Cartões: Componentes de cartões de crédito dinâmicos com suporte a múltiplas bandeiras e estilos.

[x] Resumo do Mês: Visualização rápida de faturas atuais e futuras.

[x] Timeline de Compras: Histórico de transações com categorização visual.

[ ] Split Inteligente: Divisão de compras integrada ao WhatsApp.

[ ] Integração com Backend: Persistência de dados utilizando Supabase.

🛠️ Tecnologias Utilizadas

React: Biblioteca JavaScript para construção de interfaces de usuário.

Vite: Ferramenta de build super rápida para projetos web modernos.

TypeScript: Tipagem estática para JavaScript, garantindo um código mais seguro e escalável.

Tailwind CSS v4: Framework CSS utilitário para estilização rápida e responsiva.

Lucide React: Biblioteca de ícones minimalistas e consistentes.

🚀 Como executar o projeto localmente

Pré-requisitos

Você precisará ter o Node.js instalado na sua máquina (versão LTS recomendada).

Passos de Instalação

Clone este repositório:

git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git


Acesse a pasta do projeto:

cd spendify_app


Instale as dependências:

npm install


Inicie o servidor de desenvolvimento:

npm run dev


Abra o navegador no endereço indicado no terminal (geralmente http://localhost:5173).

📁 Estrutura de Pastas

src/
 ├── components/
 │    └── layout/
 │         ├── BottomNav.tsx      # Barra de navegação principal
 │         └── ui/
 │              └── CreditCard.tsx # Componente reutilizável de cartão
 ├── App.tsx                      # Componente raiz e orquestrador
 ├── main.tsx                     # Ponto de entrada do React
 └── index.css                    # Estilos globais e importação do Tailwind


👨‍💻 Autor

Desenvolvido por Jordan.
Conecte-se comigo no LinkedIn https://www.linkedin.com/in/jordan-alves-60434639b/.
