# README-DEV — Site RAITec

Documentação técnica para desenvolvedores. Este arquivo explica o que é o projeto, como ele funciona por dentro e onde cada coisa está. Para instruções de como rodar o projeto, consulte o `README.md` na raiz.

---

## O que é o projeto

O site do RAITec é um site institucional desenvolvido em Node.js com Express e EJS. Ele serve como vitrine pública da organização — exibindo membros, projetos, eventos, notícias, extensão e a Raipédia — e também possui um painel administrativo interno para gerenciar esses conteúdos.

Os dados são armazenados no Firebase Firestore (banco de dados em nuvem), e a autenticação do painel admin usa o Firebase Authentication.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Servidor | Node.js + Express |
| Templates | EJS (Embedded JavaScript) |
| Banco de dados | Firebase Firestore |
| Autenticação | Firebase Authentication |
| Sessões | express-session |
| Estilo | CSS puro (arquivos em `public/css/`) |

---

## Visão geral da arquitetura

O projeto segue o padrão MVC simplificado, sem uma camada de Model formal por enquanto. O fluxo de uma requisição é:

```
Navegador → Express (index.js) → Route → Firestore → EJS (view) → Navegador
```

O `index.js` na raiz é o ponto de entrada do servidor. Ele configura o Express, registra todos os middlewares globais e importa todos os arquivos de rotas.

---

## Estrutura de pastas

```
raitec-site/
│
├── index.js                  # Ponto de entrada — configura e sobe o servidor
│
├── routes/                   # Lógica de cada rota (controllers)
│   ├── admin/                # Rotas do painel administrativo
│   ├── quem-somos/           # Rotas de sobre, estrutura e membros
│   ├── projetos/             # Rotas de projetos
│   ├── eventos/              # Rotas de eventos
│   ├── extensao/             # Rotas de extensão
│   ├── raipedia/             # Rotas da Raipédia
│   ├── noticias/             # Rotas de notícias
│   ├── processo-seletivo/    # Rota do processo seletivo
│   └── contato/              # Rota de contato
│
├── views/                    # Templates EJS (o que o usuário vê)
│   ├── partials/             # Componentes reutilizáveis (header, footer)
│   ├── admin/                # Páginas do painel administrativo
│   ├── auth/                 # Página de login
│   ├── quem-somos/           # Páginas de sobre, estrutura e membros
│   ├── projetos/             # Páginas de projetos
│   ├── eventos/              # Páginas de eventos
│   ├── extensao/             # Páginas de extensão
│   ├── raipedia/             # Páginas da Raipédia
│   ├── noticias/             # Páginas de notícias
│   ├── processo-seletivo/    # Página do processo seletivo
│   └── contato/              # Página de contato
│
├── public/                   # Arquivos estáticos servidos diretamente
│   ├── css/                  # Folhas de estilo
│   ├── js/                   # Scripts de frontend (se houver)
│   └── images/               # Imagens estáticas
│
├── services/                 # Integrações externas
│   ├── firebase.js           # Firebase Client SDK (usado para autenticação)
│   └── firebaseAdmin.js      # Firebase Admin SDK (usado para acessar o Firestore)
│
├── middlewares/              # Funções intermediárias (ex: verificar login)
│   └── auth.js
│
└── models/                   # Estrutura de dados — pasta reservada para uso futuro
```

---

## Partes que compõem o projeto

### `index.js`
O coração do servidor. É aqui que o Express é instanciado, os middlewares globais são aplicados (parsing de formulários, arquivos estáticos, sessão) e todas as rotas são importadas e registradas. Qualquer nova rota criada precisa ser importada e registrada aqui.

---

### `routes/`
Cada arquivo dentro de `routes/` é responsável por um conjunto de URLs. Eles recebem a requisição, consultam o Firestore quando necessário, e chamam `res.render()` para exibir a view correspondente — ou `res.redirect()`, `res.status().send()` em casos de erro ou redirecionamento.

A pasta `routes/admin/` contém as rotas protegidas do painel administrativo. Atualmente o CRUD completo de membros já está implementado lá, com verificação de sessão em todas as rotas.

---

### `views/`
Os arquivos `.ejs` são os templates HTML com trechos de JavaScript embutido (marcados com `<% %>`). Cada rota renderiza uma view e passa os dados necessários como um objeto. Por exemplo: `res.render("projetos/index", { ativos, arquivados, finalizados })` disponibiliza essas três variáveis dentro do template.

A pasta `views/partials/` contém componentes reutilizados entre páginas, como o `header.ejs`, incluído em quase todas as views com `<%- include("../partials/header") %>`.

---

### `public/`
Arquivos servidos diretamente pelo Express sem passar por nenhuma rota. O CSS de cada parte do site fica aqui — `header.css`, `admin.css`, `login.css`, `style.css`. Para referenciar esses arquivos nas views, usa-se o caminho a partir de `public/`, por exemplo: `/css/header.css`.

---

### `services/`
Contém as duas instâncias do Firebase usadas no projeto:

- **`firebase.js`** — usa o Firebase Client SDK para autenticação de usuários (login no painel admin via e-mail e senha).
- **`firebaseAdmin.js`** — usa o Firebase Admin SDK para acessar o Firestore diretamente no servidor, com privilégios elevados. As credenciais são lidas de variáveis de ambiente (`.env`).

Qualquer arquivo de rota que precise consultar o banco importa o `firebaseAdmin.js`: `const db = require("../../services/firebaseAdmin")`.

---

### `middlewares/`
Pasta reservada para funções que rodam entre a requisição e a resposta. A função `verificarAuth`, que protege as rotas do painel admin, está definida diretamente em `routes/admin/membros.js` por enquanto, mas a intenção é centralizá-la aqui no `auth.js` futuramente.

---

### `models/`
Pasta ainda sem uso ativo. A ideia é que no futuro ela contenha a definição formal da estrutura dos dados (schemas), facilitando validação e manutenção.

---

## Coleções no Firestore

O banco de dados está organizado nas seguintes coleções:

| Coleção | O que armazena |
|---|---|
| `membros` | Dados dos membros da organização |
| `projetos` | Projetos com status (ativo, arquivado, finalizado) |
| `eventos` | Eventos realizados ou futuros |
| `extensao` | Ações de extensão |
| `raipedia` | Artigos e capacitações da Raipédia |
| `noticias` | Notícias publicadas |
| `eixos` | Eixos da estrutura organizacional |
| `times` | Times da estrutura organizacional |

---

## Autenticação e painel admin

O acesso ao painel em `/admin` é protegido por sessão. O fluxo é:

1. Usuário acessa `/login` e envia e-mail e senha.
2. O servidor autentica via Firebase Authentication (`signInWithEmailAndPassword`).
3. Em caso de sucesso, os dados do usuário são salvos em `req.session.usuario`.
4. As rotas de admin verificam se `req.session.usuario` existe antes de processar qualquer requisição.
5. O logout em `/logout` destrói a sessão e redireciona para `/login`.

---

## Variáveis de ambiente necessárias

O projeto depende de um arquivo `.env` na raiz (não enviado ao GitHub) com as seguintes variáveis para o Firebase Admin SDK:

```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Sem essas variáveis, o servidor não consegue conectar ao Firestore e vai lançar um erro na inicialização.

---

## Documentação por pasta

Cada pasta principal possui seu próprio arquivo de documentação com detalhes mais aprofundados:

- [`routes/ROUTES.md`](routes/ROUTES.md) — padrão de rotas, listagem completa de endpoints
- [`views/VIEWS.md`](views/VIEWS.md) — estrutura de templates, variáveis esperadas por cada view
- [`public/PUBLIC.md`](public/PUBLIC.md) — arquivos estáticos e CSS
- [`services/SERVICES.md`](services/SERVICES.md) — Firebase, coleções e variáveis de ambiente
- [`middlewares/MIDDLEWARES.md`](middlewares/MIDDLEWARES.md) — autenticação e proteção de rotas

---

*Documentação mantida pelo Time de Mídias RAITec.*
>**Contribuintes**
Gabriel Gonzaga Sá Barreto - Consultor 