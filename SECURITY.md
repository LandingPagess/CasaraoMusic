# Security Policy

## Acesso ao painel administrativo

O painel em `/admin` é protegido por autenticação via **GitHub OAuth**. Apenas usuários com acesso de escrita ao repositório `LandingPagess/CasaraoMusic` conseguem fazer login.

O acesso é gerenciado diretamente pelo GitHub:

> **GitHub → `LandingPagess/CasaraoMusic` → Settings → Collaborators**

Para revogar o acesso de um usuário, remova-o dos colaboradores do repositório.

## Variáveis de ambiente sensíveis

| Variável | Onde fica | Risco se exposta |
|---|---|---|
| `GITHUB_CLIENT_SECRET` | Vercel (server-side) | Permite trocar códigos OAuth por tokens em nome do app |
| `GITHUB_CLIENT_ID` | Vercel + `config.yml` (público) | Baixo risco — identifica o app, não autentica |

`GITHUB_CLIENT_SECRET` **nunca deve ser commitado** no repositório. Ela é usada exclusivamente pela função serverless `api/callback.js` no servidor.

## Escopo do token OAuth

O OAuth App solicita o escopo `repo` (leitura e escrita em repositórios). Esse escopo é necessário para o CMS criar e editar arquivos em `src/content/eventos/`.

Se quiser restringir ainda mais, é possível usar `public_repo` caso o repositório seja público.

## Reportar uma vulnerabilidade

Abra uma issue privada ou envie um e-mail para o mantenedor do projeto descrevendo:

1. O componente afetado (`api/auth.js`, `api/callback.js`, CMS, etc.)
2. A natureza da vulnerabilidade
3. Passos para reproduzir (se aplicável)

Não publique detalhes de vulnerabilidades em issues públicas antes de uma correção ser disponibilizada.
