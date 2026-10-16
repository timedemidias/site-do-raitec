# ROUTES.md — Pasta `routes/`

Documentação técnica das rotas do projeto. Este arquivo explica como o sistema de rotas funciona, o padrão adotado, a listagem completa de endpoints e como adicionar novas rotas corretamente.

---

## O que é uma rota

No Express, uma rota é a combinação de um método HTTP (`GET`, `POST`) com uma URL. Cada arquivo dentro de `routes/` é responsável por um conjunto de rotas relacionadas. O Express recebe a requisição do navegador, verifica qual rota corresponde à URL e ao método, executa o código daquela rota e devolve uma resposta.

O fluxo básico de uma requisição no projeto é:

```
Navegador → index.js → arquivo de rota → Firestore (se necessário) → res.render() → EJS → Navegador
```

---

## Como as rotas são registradas

Todas as rotas são importadas e registradas no `index.js` na raiz do projeto. Cada arquivo de rota exporta um `router` do Express, que é então passado para `app.use()`:

```js
// Exemplo de registro em index.js
const membrosRouter = require("./routes/quem-somos/membros/membros");
app.use(membrosRouter);
```

**Qualquer nova rota criada precisa ser importada e registrada no `index.js`.** Caso contrário, a URL simplesmente não será reconhecida pelo servidor.

---

## Estrutura de pastas

```
routes/
│
├── admin/
│   ├── admin.js              # Rota do painel administrativo (dashboard)
│   ├── auth.js               # Login e logout
│   ├── membros.js            # CRUD completo de membros (protegido)
│   └── noticias.js           # (arquivo vazio — reservado para uso futuro)
│
├── quem-somos/
│   ├── sobre.js              # Página sobre o RAITec
│   ├── estrutura.js          # Eixos e times
│   └── membros/
│       └── membros.js        # Listagem e página individual de membros
│
├── projetos/
│   ├── projetos.js           # Listagem e página individual de projetos
│   ├── injetar.js            # Script utilitário — injeta projeto no Firestore
│   ├── povoarbanco.js        # Script utilitário — popula banco com dados do Regador
│   └── migrarptodos.js       # Script utilitário — migra todos os projetos para o Firestore
│
├── eventos/
│   └── eventos.js            # Listagem e página individual de eventos
│
├── extensao/
│   └── extensao.js           # Listagem e página individual de extensões
│
├── raipedia/
│   └── raipedia.js           # Listagem e página individual de artigos da Raipédia
│
├── noticias/
│   └── noticias.js           # Listagem e página individual de notícias
│
├── processo-seletivo/
│   └── processo-seletivo.js  # Página do processo seletivo
│
├── contato/
│   └── contato.js            # Página de contato
│
└── teste.js                  # Rota de teste de conexão com o Firebase
```

> ⚠️ Os arquivos `injetar.js`, `povoarbanco.js` e `migrarptodos.js` dentro de `routes/projetos/` são **scripts utilitários de migração**, executados diretamente com Node.js (`node routes/projetos/migrarptodos.js`). Eles **não são rotas HTTP** e não devem ser registrados no `index.js`.

---

## Padrão adotado nas rotas

Todos os arquivos de rota seguem o mesmo padrão estrutural:

```js
const express = require("express");
const router = express.Router();
const db = require("../../services/firebaseAdmin"); // se precisar do banco

// Definição das rotas
router.get("/rota", async (req, res) => {
  try {
    // lógica aqui
    res.render("pasta/view", { dados });
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Mensagem de erro");
  }
});

module.exports = router;
```

**Convenções seguidas:**
- Rotas `GET` para exibir páginas
- Rotas `POST` para processar formulários (criar, editar, deletar)
- Sempre usar `try/catch` nas rotas assíncronas
- Redirecionar com `res.redirect()` após ações de escrita (criar, editar, deletar)
- Retornar `res.status(404)` quando um recurso não é encontrado
- Retornar `res.status(500)` para erros internos do servidor

---

## Listagem completa de endpoints

### Públicas — Início e páginas estáticas

| Método | URL | Arquivo | View renderizada |
|--------|-----|---------|-----------------|
| GET | `/` | `index.js` (raiz) | `index.ejs` |
| GET | `/sobre` | `quem-somos/sobre.js` | `quem-somos/sobre.ejs` |
| GET | `/contato` | `contato/contato.js` | `contato/contato.ejs` |
| GET | `/processo-seletivo` | `processo-seletivo/processo-seletivo.js` | `processo-seletivo/processo-seletivo.ejs` |

---

### Públicas — Estrutura (Eixos e Times)

| Método | URL | Arquivo | View renderizada | Dados buscados |
|--------|-----|---------|-----------------|----------------|
| GET | `/estrutura` | `quem-somos/estrutura.js` | `quem-somos/estrutura.ejs` | Coleções `eixos` e `times` |
| GET | `/eixos/:slug` | `quem-somos/estrutura.js` | `quem-somos/eixo.ejs` | Documento em `eixos` pelo ID |
| GET | `/times/:slug` | `quem-somos/estrutura.js` | `quem-somos/time.ejs` | Documento em `times` pelo ID |

**Observação:** O parâmetro `:slug` nas rotas de eixos e times corresponde ao **ID do documento no Firestore**, não a um campo `slug` interno. Isso significa que o ID do documento deve ser definido como um identificador legível na hora de criá-lo (ex: `tecnico`, `midias`).

---

### Públicas — Membros

| Método | URL | Arquivo | View renderizada | Dados buscados |
|--------|-----|---------|-----------------|----------------|
| GET | `/membros` | `quem-somos/membros/membros.js` | `quem-somos/membros/index.ejs` | Coleção `membros` |
| GET | `/membros/:slug` | `quem-somos/membros/membros.js` | `quem-somos/membros/membro.ejs` | Documento em `membros` onde `slug == :slug` |

---

### Públicas — Projetos

| Método | URL | Arquivo | View renderizada | Dados buscados |
|--------|-----|---------|-----------------|----------------|
| GET | `/projetos` | `projetos/projetos.js` | `projetos/index.ejs` | Coleção `projetos` separada por `status` |
| GET | `/projetos/:id` | `projetos/projetos.js` | `projetos/projeto.ejs` | Documento em `projetos` pelo ID ou pelo campo `slug` |

**Observação:** A rota `/projetos/:id` tenta primeiro buscar pelo ID direto do documento. Se não encontrar, faz uma segunda busca pelo campo `slug`. Isso garante compatibilidade tanto com links gerados pelo ID do Firestore quanto por slug legível.

---

### Públicas — Eventos

| Método | URL | Arquivo | View renderizada | Dados buscados |
|--------|-----|---------|-----------------|----------------|
| GET | `/eventos` | `eventos/eventos.js` | `eventos/index.ejs` | Coleção `eventos` |
| GET | `/eventos/:slug` | `eventos/eventos.js` | `eventos/evento.ejs` | Documento em `eventos` onde `slug == :slug` |

---

### Públicas — Extensão

| Método | URL | Arquivo | View renderizada | Dados buscados |
|--------|-----|---------|-----------------|----------------|
| GET | `/extensao` | `extensao/extensao.js` | `extensao/index.ejs` | Coleção `extensao` |
| GET | `/extensao/:slug` | `extensao/extensao.js` | `extensao/extensao.ejs` | Documento em `extensao` onde `slug == :slug` |

---

### Públicas — Raipédia

| Método | URL | Arquivo | View renderizada | Dados buscados |
|--------|-----|---------|-----------------|----------------|
| GET | `/raipedia` | `raipedia/raipedia.js` | `raipedia/index.ejs` | Coleção `raipedia` |
| GET | `/raipedia/:slug` | `raipedia/raipedia.js` | `raipedia/raipedia.ejs` ou `raipedia/microcontroladores.ejs` | Documento em `raipedia` onde `slug == :slug` |

**Observação:** A rota `/raipedia/:slug` verifica o campo `categoria` do documento encontrado. Se `categoria === "microcontroladores"`, renderiza a view especial `microcontroladores.ejs` com layout de documentação técnica. Para qualquer outra categoria, renderiza `raipedia.ejs`.

---

### Públicas — Notícias

| Método | URL | Arquivo | View renderizada | Dados buscados |
|--------|-----|---------|-----------------|----------------|
| GET | `/noticias` | `noticias/noticias.js` | `noticias/index.ejs` | Coleção `noticias` |
| GET | `/noticias/:slug` | `noticias/noticias.js` | `noticias/noticias.ejs` | Documento em `noticias` onde `slug == :slug` |

---

### Autenticação

| Método | URL | Arquivo | Descrição |
|--------|-----|---------|-----------|
| GET | `/login` | `admin/auth.js` | Exibe a tela de login. Redireciona para `/admin` se já estiver logado |
| POST | `/login` | `admin/auth.js` | Processa o login via Firebase Authentication e salva a sessão |
| GET | `/logout` | `admin/auth.js` | Destrói a sessão e redireciona para `/login` |

---

### Admin — Painel (protegidas)

Todas as rotas abaixo exigem sessão ativa (`req.session.usuario`). Caso o usuário não esteja autenticado, é redirecionado para `/login`.

| Método | URL | Arquivo | View renderizada | Descrição |
|--------|-----|---------|-----------------|-----------|
| GET | `/admin` | `admin/admin.js` | `admin/index.ejs` | Dashboard do painel administrativo |

---

### Admin — CRUD de Membros (protegidas)

| Método | URL | Arquivo | View renderizada | Descrição |
|--------|-----|---------|-----------------|-----------|
| GET | `/admin/membros` | `admin/membros.js` | `admin/membros/index.ejs` | Lista todos os membros |
| GET | `/admin/membros/criar` | `admin/membros.js` | `admin/membros/criar.ejs` | Exibe o formulário de criação |
| POST | `/admin/membros/criar` | `admin/membros.js` | — | Processa a criação e redireciona para `/admin/membros` |
| GET | `/admin/membros/:id/editar` | `admin/membros.js` | `admin/membros/editar.ejs` | Exibe o formulário de edição com dados pré-preenchidos |
| POST | `/admin/membros/:id/editar` | `admin/membros.js` | — | Processa a edição e redireciona para `/admin/membros` |
| POST | `/admin/membros/:id/deletar` | `admin/membros.js` | — | Remove o membro e redireciona para `/admin/membros` |

**Observação:** As operações de criação e edição de membros realizam tratamento automático dos campos `projetos` e `coordenador`, convertendo strings separadas por vírgula em arrays. O campo `ativo` é convertido de string `"on"` para booleano `true`.

---

### Utilitários

| Método | URL | Arquivo | Descrição |
|--------|-----|---------|-----------|
| GET | `/teste-firebase` | `teste.js` | Retorna os dados da coleção `teste` em JSON. Usado para verificar a conexão com o Firestore |

---

## Proteção das rotas admin

A verificação de autenticação nas rotas de admin é feita por um middleware local definido dentro do próprio `routes/admin/membros.js`:

```js
function verificarAuth(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect("/login");
  }
  next();
}

// Aplicado a todas as rotas do router
router.use(verificarAuth);
```

O `router.use(verificarAuth)` garante que **todas** as rotas registradas naquele arquivo passem pela verificação antes de serem executadas.

> A intenção futura é mover essa função para `middlewares/auth.js` e importá-la em todos os arquivos admin, evitando duplicação de código. Quando isso for implementado, basta fazer:
> ```js
> const verificarAuth = require("../../middlewares/auth");
> router.use(verificarAuth);
> ```

---

## Como adicionar uma nova rota

### 1. Criar o arquivo de rota

Dentro da pasta correspondente em `routes/`, criar o arquivo seguindo o padrão:

```js
const express = require("express");
const router = express.Router();
const db = require("../../services/firebaseAdmin");

router.get("/nova-secao", async (req, res) => {
  try {
    const snapshot = await db.collection("nova-colecao").get();

    const itens = [];
    snapshot.forEach(doc => {
      itens.push({ id: doc.id, ...doc.data() });
    });

    res.render("nova-secao/index", { itens });

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao buscar dados");
  }
});

module.exports = router;
```

### 2. Registrar no `index.js`

```js
const novaSecaoRouter = require("./routes/nova-secao/nova-secao");
app.use(novaSecaoRouter);
```

### 3. Criar a view correspondente

Criar o arquivo `.ejs` em `views/nova-secao/` com as variáveis que a rota passa no `res.render()`.

---

## Erros comuns

**404 em uma URL que deveria existir** — verificar se o arquivo de rota foi importado e registrado no `index.js`.

**Variável undefined na view** — verificar se o dado está sendo passado corretamente no objeto do `res.render()`. Tudo que a view usa precisa estar no objeto.

**Erro ao buscar por slug** — as buscas por slug usam `.where("slug", "==", slug)`, que requer um índice no Firestore caso combine com outras cláusulas. Para buscas simples por um único campo, funciona sem índice adicional.

**Rota POST não encontrada** — formulários HTML só suportam `GET` e `POST`. Verificar se o `method="POST"` está no `<form>` e se a rota correspondente usa `router.post()`.

**Conflito de rotas** — o Express resolve rotas na ordem em que são registradas. Se houver `/membros/criar` e `/membros/:slug`, a rota `/criar` precisa ser registrada **antes** da rota com parâmetro, senão o Express interpreta `criar` como um slug.

---

## Bugs conhecidos

**`projetos/projeto.ejs`** — a view referencia a variável como `projetos.nome` (plural) em vez de `projeto.nome` (singular), inconsistente com o padrão do restante do projeto. A rota passa `{ projeto }`, mas a view consome `projetos`. Isso causa erro de renderização na página individual de projetos.

**`noticias/noticias.js`** — a rota individual renderiza `noticias/noticias.ejs`, mas o arquivo da view se chama `noticias/noticia.ejs` (sem o 's' final). O nome deve ser corrigido em um dos dois lados para que a rota funcione.

---

*Documentação mantida pelo Time de Mídias RAITec.*
>**Contribuintes**
Gabriel Gonzaga Sá Barreto - Consultor
