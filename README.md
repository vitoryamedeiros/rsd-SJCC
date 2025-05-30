# Projeto Comentários Moderados com Firebase e Google Gemini

> “Palavras são poderosas. Aqui, a gente deixa só as que valem a pena.”

---

## 🚀 Sobre o Projeto

Este projeto é uma aplicação simples e elegante para receber comentários de usuários, moderar automaticamente o conteúdo usando inteligência artificial (Google Gemini), e armazenar tudo no banco de dados em nuvem (Firebase Firestore).

Ideal para quem quer um sistema de comentários limpo, com moderação automática que filtra discurso de ódio, preconceito, ofensas e mais. Tudo na moral, sem intervenção manual.

---

## 🧰 Tecnologias Usadas

- **Firebase Firestore**: banco de dados NoSQL em nuvem, para salvar comentários aprovados e reprovados.
- **Firebase SDK (v9 modular)**: para inicializar e interagir com o Firestore.
- **Google Gemini API**: IA de linguagem para moderação automática dos comentários.
- **JavaScript (ES6 Modules)**: lógica do frontend, manipulação do DOM e chamadas assíncronas.
- **Fetch API**: comunicação REST com a Google Gemini.
- **HTML/CSS**: estrutura e estilo dos comentários na tela (pode ser Tailwind CSS ou custom).
- **Date API do JS**: para formatação amigável das datas dos comentários.

---

## ⚙️ Funcionalidades

- Envio de comentários via formulário simples.
- Moderação automática de comentários via API do Google Gemini:
  - A IA responde “sim” ou “não” para indicar se o comentário contém conteúdo inadequado.
- Salvamento dos comentários no Firestore com status `"aprovado"` ou `"reprovado"`.
- Exibição em tempo real dos comentários aprovados na tela, ordenados por data.
- Feedback imediato ao usuário sobre a aprovação ou reprovação do comentário.
- Exibição da data/hora formatada no padrão brasileiro.

---

## 📦 Como Rodar o Projeto

1. Clone este repositório:
    ```bash
    git clone https://github.com/vitoryamedeiros/rsd-SJCC.git
    cd rsd-SJCC
    ```

2. Configure o Firebase:
    - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
    - Ative o Firestore Database.
    - Copie suas credenciais (`apiKey`, `authDomain`, etc) e substitua no arquivo principal.

3. Obtenha a API Key do Google Gemini (via Google Cloud Console).

4. Substitua a variável `GEMINI_API_KEY` pelo seu valor no código.

5. Abra o arquivo `index.html` no navegador (não precisa de backend, roda direto).

---

## 📝 Estrutura do Código

- `index.html` — Formulário de envio e área de comentários.
- `main.js` — Lógica de inicialização do Firebase, chamadas para Gemini, manipulação do DOM.
- **Firebase Firestore** — Armazenamento dos comentários com status e data.
- **Google Gemini API** — Moderação dos textos.

---

## 🤝 Como Contribuir

Quer deixar o projeto ainda mais robusto? Pode abrir issues, sugerir melhorias ou mandar pull requests! Algumas ideias:

- Sistema de login para usuários.
- Respostas automáticas inteligentes.
- Interface mais bonita com animações.
- Histórico e edição de comentários.

---

## 📝 Licença

MIT © Fabiuu

---

## 💬 Contato

Se quiser trocar ideia, tirar dúvida, ou só conversar sobre programação e design, me chama!
