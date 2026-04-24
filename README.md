<div align="center">
  <img src="https://raw.githubusercontent.com/1projetovisto-web/visto_lab_landing/main/public/favicon.png" alt="VISTO_LAB" width="300" />
</div>

# VISTO_LAB — Landing Page

**Plataforma de arte soberana para artistas digitais brasileiros**
`lab.visto.art.br` · desenvolvido com [vibe coding + [studio core0gam3] 

![Deploy](https://img.shields.io/badge/deploy-vercel-00C7B7?style=flat-square)
![Firebase](https://img.shields.io/badge/database-firebase-FFCA28?style=flat-square)
![Status](https://img.shields.io/badge/status-live-C8F135?style=flat-square)

</div>

---

## Sobre o projeto

Landing page de lançamento da plataforma **VISTO_LAB** (`visto.art.br`) — uma iniciativa de soberania digital para artistas que se recusam a depender de algoritmos de big techs para existir e vender seu trabalho.

A página foi construída com estética **terminal/hacker dark**, captura de emails via Firebase Firestore e estrutura de marketing orientada a conversão (AIDA).

🔗 **Ao vivo em:** [lab.visto.art.br](https://lab.visto.art.br)

---

## Stack

- **HTML5 / CSS3 / Vanilla JS** — sem frameworks, zero dependências de runtime
- **Google Fonts** — Space Mono + DM Sans
- **Netlify** — hospedagem e serverless functions
- **Firebase Firestore** — banco de dados de leads
- **Resend** — disparo de email de boas-vindas
- **Brevo** — CRM e campanhas de marketing

---

## Arquitetura de captura de leads

```
Visitante digita email em lab.visto.art.br
              ↓
Netlify Function (subscribe.ts) — segura, keys protegidas
              ↓
Firebase Firestore → coleção: leads
  - email        (string)
  - createdAt    (timestamp)
  - userAgent    (string)
  - protocol     (SOMATIC_ACTIVATION_V4_NETLIFY)
              ↓
Resend → email de boas-vindas
  de: contato@lab.visto.art.br
              ↓
Brevo → campanhas futuras de lançamento
```

---

## Segurança

- API Keys protegidas em **variáveis de ambiente do Netlify** — nunca expostas no repositório
- `firestore.rules` bloqueia leitura dos leads pelo browser
- Apenas a Netlify Function tem permissão de escrita no Firestore

---

## Estrutura da página

```
/
├── Hero              → Promessa principal + captura de email
├── Ticker            → Dores do mercado em loop animado
├── Problema          → 6 dores específicas do artista digital
├── Solução           → Terminal interativo com diferenciais
├── Stats             → Números de valor da plataforma
├── Features          → 6 diferenciais + gatilho de escassez
└── CTA Final         → Segunda captura de email
```

---

## Rodar localmente

**Pré-requisito:** Node.js instalado

1. Clone o repositório:
   ```bash
   git clone https://github.com/1projetovisto-web/visto_lab_landing.git
   cd visto_lab_landing
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente — crie um arquivo `.env.local`:
   ```
   BREVO_API_KEY=sua_key_aqui
   RESEND_API_KEY=sua_key_aqui
   ```

4. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse em `http://localhost:3000`

---

## Ver leads capturados

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto VISTO_LAB
3. Menu lateral → **Firestore Database**
4. Coleção **leads** → todos os emails registrados

Para exportar para o Brevo e disparar campanhas:
1. Exporta os emails do Firestore
2. Importa no Brevo
3. Dispara a campanha de lançamento 🚀

---

## Ecossistema VISTO_LAB

```
visto.art.br              → site principal
lab.visto.art.br          → landing page (este repo)
cadeira.visto.art.br      → workshops e tutoriais
```

---

## Créditos

Desenvolvido com **vibe coding** + **studio core0gam3**

---

<div align="center">

`VISTO_LAB © 2026` · `visto.art.br` .

</div>

