# Casarão Music

Landing page oficial do **Casarão Music** — bar de música ao vivo em Salvador, BA.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Astro 5 (output: static) |
| CSS | Tailwind CSS v4 (CSS-first, sem `tailwind.config.js`) |
| Fontes | `@fontsource/playfair-display`, `@fontsource/inter` |
| CMS | Sveltia CMS + GitHub backend |
| Auth | GitHub OAuth (proxy próprio via Vercel Functions) |
| Deploy | Vercel |

## Estrutura

```
/
├── api/                       # Vercel serverless functions
│   ├── auth.js                # Inicia OAuth → redireciona para GitHub
│   └── callback.js            # Troca code por token, envia via postMessage
│
├── public/
│   ├── admin/
│   │   ├── index.html         # Redireciona para cms.html
│   │   ├── cms.html           # Carrega Sveltia CMS
│   │   └── config.yml         # Configuração do CMS (coleções, campos)
│   └── uploads/               # Imagens enviadas pelo CMS
│
└── src/
    ├── components/            # Header, Hero, Programacao, Galeria, FAQ, Footer…
    ├── content/
    │   ├── config.ts          # Schema Zod para a coleção "eventos"
    │   └── eventos/           # Arquivos .md criados/editados pelo CMS
    ├── layouts/Layout.astro   # Base: SEO, IntersectionObserver, botão WhatsApp
    ├── pages/index.astro
    └── styles/global.css      # @theme Tailwind v4, keyframes, animações
```

## Desenvolvimento local

```bash
npm install
npm run dev
```

O painel CMS (`/admin`) só funciona em produção — requer GitHub OAuth e as variáveis de ambiente configuradas no Vercel.

## Variáveis de ambiente

Configurar no painel do Vercel (Settings → Environment Variables):

| Variável | Descrição |
|---|---|
| `GITHUB_CLIENT_ID` | Client ID do OAuth App no GitHub |
| `GITHUB_CLIENT_SECRET` | Client Secret do OAuth App no GitHub |

### Criar o OAuth App no GitHub

1. GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**
2. **Homepage URL:** `https://casarao-music.vercel.app`
3. **Authorization callback URL:** `https://casarao-music.vercel.app/api/callback`

## Deploy

```bash
vercel --prod
```

## CMS — Painel de controle

Acesse: `https://casarao-music.vercel.app/admin`

Fluxo de autenticação:
1. Clique em **Login with GitHub**
2. Autorize o app (incluindo acesso à organização `LandingPagess`, se solicitado)
3. O painel carrega com a coleção **Eventos / Programação**

Alterações feitas pelo CMS criam commits diretamente em `src/content/eventos/` na branch `main`. O Vercel detecta o push e faz o redeploy automaticamente.

## Conteúdo editável via CMS

- Artista / Nome do evento
- Data (formato DD/MM)
- Dia da semana
- Estilo musical
- Descrição curta
- Tag opcional (Ex: "Novo", "Imperdível")
- Destaque (ocupa mais espaço na grade)
- Imagem de capa

## Licença

MIT — veja [LICENSE](./LICENSE).
