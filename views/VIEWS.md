# VIEWS.md — Pasta `views/`

Documentação técnica dos templates EJS do projeto. Este arquivo explica como o sistema de views funciona, a convenção de organização das pastas, como os dados chegam até os templates e o que cada view espera receber.

---

## O que é EJS

EJS (Embedded JavaScript) é uma engine de templates que permite escrever HTML com trechos de JavaScript embutido. O Express renderiza esses arquivos no servidor e envia o HTML final para o navegador.

As três sintaxes mais usadas no projeto:

| Sintaxe | O que faz |
|---|---|
| `<%= variavel %>` | Imprime o valor da variável (com escape de HTML) |
| `<% codigo %>` | Executa código JavaScript sem imprimir nada |
| `<%- include("caminho") %>` | Inclui outro arquivo EJS sem escape (usado nos partials) |

---

## Estrutura de pastas

```
views/
│
├── index.ejs                      # Página inicial
│
├── partials/                      # Componentes reutilizáveis
│   ├── header.ejs                 # Menu de navegação
│   └── footer.ejs                 # Rodapé (ainda vazio)
│
├── auth/
│   └── login.ejs                  # Tela de login do admin
│
├── admin/                         # Páginas do painel administrativo
│   ├── index.ejs                  # Dashboard do admin
│   └── membros/
│       ├── index.ejs              # Listagem de membros (admin)
│       ├── criar.ejs              # Formulário de criação de membro
│       └── editar.ejs             # Formulário de edição de membro
│
├── quem-somos/                    # Seção institucional
│   ├── sobre.ejs                  # Página Sobre o RAITec
│   ├── estrutura.ejs              # Listagem de eixos e times
│   ├── eixo.ejs                   # Página individual de um eixo
│   ├── time.ejs                   # Página individual de um time
│   ├── eixo-time.ejs              # View combinada (legado, ver observação)
│   └── membros/
│       ├── index.ejs              # Listagem de membros
│       └── membro.ejs             # Página individual de um membro
│
├── projetos/
│   ├── index.ejs                  # Listagem de projetos (ativos, arquivados, finalizados)
│   └── projeto.ejs                # Página individual de um projeto
│
├── eventos/
│   ├── index.ejs                  # Listagem de eventos
│   └── evento.ejs                 # Página individual de um evento
│
├── extensao/
│   ├── index.ejs                  # Listagem de extensões
│   └── extensao.ejs               # Página individual de uma extensão
│
├── raipedia/
│   ├── index.ejs                  # Listagem de artigos
│   ├── raipedia.ejs               # Artigo genérico
│   └── microcontroladores.ejs     # Layout especial para capacitações de microcontroladores
│
├── noticias/
│   ├── index.ejs                  # Listagem de notícias
│   └── noticia.ejs                # Notícia individual
│
├── processo-seletivo/
│   └── processo-seletivo.ejs      # Página do processo seletivo
│
└── contato/
    └── contato.ejs                # Página de contato
```

---

## Partials

Os partials são fragmentos de HTML reutilizados em múltiplas páginas. Ficam em `views/partials/` e são incluídos com `<%- include() %>`.

### `header.ejs`
O menu de navegação principal do site. Incluído em praticamente todas as views públicas.

**Como incluir** (o caminho é relativo ao arquivo que está fazendo o include):
```ejs
<%- include("../partials/header") %>      <!-- para views um nível abaixo de views/ -->
<%- include("../../partials/header") %>   <!-- para views dois níveis abaixo, como quem-somos/membros/ -->
```

O header carrega automaticamente o `/css/header.css` e não recebe variáveis externas — ele é estático.

### `footer.ejs`
Arquivo existe mas está vazio. Reservado para implementação futura.

---

## Como os dados chegam até a view

A rota chama `res.render()` passando o nome do template e um objeto com os dados:

```js
// Na rota:
res.render("projetos/index", { ativos, arquivados, finalizados });
```

```ejs
<!-- Na view, as variáveis ficam disponíveis diretamente: -->
<% ativos.forEach(p => { %>
  <li><%= p.nome %></li>
<% }) %>
```

Tudo que não for passado no objeto do `res.render()` não existe na view — tentar acessar uma variável não passada gera erro de renderização.

---

## Views e suas variáveis

Abaixo estão todas as views com as variáveis que cada uma espera receber.

---

### `index.ejs`
Página inicial. Não recebe variáveis — apenas renderiza o HTML estático.

---

### `auth/login.ejs`
Tela de login do painel admin. Não recebe variáveis.

O formulário envia `POST /login` com os campos `email` e `senha`.

---

### `admin/index.ejs`
Dashboard do painel administrativo. Não recebe variáveis — apenas exibe os cards de navegação para cada seção gerenciável.

---

### `admin/membros/index.ejs`
Listagem de membros no painel admin, com botões de editar e excluir.

| Variável | Tipo | Descrição |
|---|---|---|
| `membros` | array | Lista de objetos de membro, cada um com `id` e todos os campos do Firestore |

> O campo `id` é obrigatório aqui pois é usado nos links de edição (`/admin/membros/:id/editar`) e nos formulários de exclusão.

---

### `admin/membros/criar.ejs`
Formulário de criação de novo membro. Não recebe variáveis.

O formulário envia `POST /admin/membros/criar` com os campos: `nome`, `slug`, `foto`, `eixo`, `time`, `descricao`, `projetos`, `ativo`, `coordenador`.

---

### `admin/membros/editar.ejs`
Formulário de edição de membro existente, com os campos pré-preenchidos.

| Variável | Tipo | Descrição |
|---|---|---|
| `membro` | objeto | Dados do membro a ser editado, incluindo o `id` |

O formulário envia `POST /admin/membros/:id/editar`.

---

### `quem-somos/sobre.ejs`
Página institucional sobre o RAITec. Não recebe variáveis — conteúdo estático.

---

### `quem-somos/estrutura.ejs`
Exibe a listagem de eixos e times com links para as páginas individuais de cada um.

| Variável | Tipo | Descrição |
|---|---|---|
| `eixos` | array | Lista de objetos de eixo, cada um com `id` e `nome` |
| `times` | array | Lista de objetos de time, cada um com `id` e `nome` |

Os links gerados usam o `id` do documento do Firestore como parâmetro de URL (`/eixos/:id` e `/times/:id`).

---

### `quem-somos/eixo.ejs`
Página individual de um eixo.

| Variável | Tipo | Descrição |
|---|---|---|
| `eixo` | objeto | Dados do eixo com `nome` e `descricao` |

---

### `quem-somos/time.ejs`
Página individual de um time.

| Variável | Tipo | Descrição |
|---|---|---|
| `time` | objeto | Dados do time com `nome` e `descricao` |

---

### `quem-somos/eixo-time.ejs`
View combinada que renderiza eixo ou time dependendo do que for passado. Usa condicionais para exibir apenas o que existir.

| Variável | Tipo | Descrição |
|---|---|---|
| `eixo` | objeto ou `null` | Dados do eixo, se aplicável |
| `time` | objeto ou `null` | Dados do time, se aplicável |

> ⚠️ Esta view é um legado da versão anterior da rota `/estrutura/:slug`. Hoje as rotas `/eixos/:slug` e `/times/:slug` usam `eixo.ejs` e `time.ejs` separadamente. O arquivo `eixo-time.ejs` pode ser removido futuramente.

---

### `quem-somos/membros/index.ejs`
Listagem pública de membros.

| Variável | Tipo | Descrição |
|---|---|---|
| `membros` | array | Lista de objetos de membro com `slug`, `nome`, `eixo` e `time` |

---

### `quem-somos/membros/membro.ejs`
Página pública individual de um membro.

| Variável | Tipo | Descrição |
|---|---|---|
| `membro` | objeto | Dados completos do membro: `nome`, `eixo`, `time`, `descricao` |

---

### `projetos/index.ejs`
Listagem de projetos separados por status.

| Variável | Tipo | Descrição |
|---|---|---|
| `ativos` | array | Projetos com `status: "ativo"` |
| `arquivados` | array | Projetos com `status: "arquivado"` |
| `finalizados` | array | Projetos com `status: "finalizado"` |

Cada item do array precisa ter `id` e `nome` para gerar os links corretamente.

---

### `projetos/projeto.ejs`
Página individual de um projeto.

| Variável | Tipo | Descrição |
|---|---|---|
| `projeto` | objeto | Dados completos do projeto |

> ⚠️ Atenção: a view referencia a variável como `projetos.nome` (no plural) em vez de `projeto.nome`, o que é inconsistente com o padrão do restante do projeto. Isso é um bug a ser corrigido.

---

### `eventos/index.ejs`
Listagem de eventos.

| Variável | Tipo | Descrição |
|---|---|---|
| `eventos` | array | Lista de objetos de evento com `slug` e `nome` |

---

### `eventos/evento.ejs`
Página individual de um evento.

| Variável | Tipo | Descrição |
|---|---|---|
| `evento` | objeto | Dados do evento com `nome` e `descricao` |

---

### `extensao/index.ejs`
Listagem de ações de extensão.

| Variável | Tipo | Descrição |
|---|---|---|
| `extensoes` | array | Lista de objetos de extensão com `slug` e `nome` |

---

### `extensao/extensao.ejs`
Página individual de uma ação de extensão.

| Variável | Tipo | Descrição |
|---|---|---|
| `extensao` | objeto | Dados da extensão com `nome` e `descricao` |

---

### `raipedia/index.ejs`
Listagem de artigos da Raipédia.

| Variável | Tipo | Descrição |
|---|---|---|
| `raipedia` | array | Lista de artigos com `slug` e `nome` |

---

### `raipedia/raipedia.ejs`
Artigo genérico da Raipédia. Usado para artigos sem categoria especial.

| Variável | Tipo | Descrição |
|---|---|---|
| `raipedia` | objeto | Dados do artigo com `nome`, `descricao` e `conteudo` |

> ⚠️ O campo `descricao` aparece duas vezes na view (uma dentro da tag `<strong>Descrição:</strong>` e outra logo abaixo solta). Isso parece ser um erro de duplicação a ser corrigido.

---

### `raipedia/microcontroladores.ejs`
Layout especial para capacitações de microcontroladores. Possui sidebar de navegação com scroll spy, seções organizadas por nível (Básico, Intermediário, Avançado) e um hero com estatísticas.

Existe em duas versões:
- `microcontroladores.ejs` — versão semântica sem CSS próprio (usa o `header.ejs`)
- `microcontroladorescss.ejs` — versão com CSS completo embutido e layout próprio (não usa o `header.ejs`)

A rota em `routes/raipedia/raipedia.js` renderiza `microcontroladores.ejs` quando `raipedia.categoria === "microcontroladores"`.

| Variável | Tipo | Descrição |
|---|---|---|
| `raipedia` | objeto | Objeto com estrutura aninhada complexa (ver abaixo) |

**Estrutura esperada do objeto `raipedia` para microcontroladores:**
```json
{
  "nome-micro": "Arduino",
  "descricao-inicial": "Texto introdutório...",
  "o-que-e": {
    "historia": "...",
    "variantes-de-hardware": "...",
    "comparacoes-com-outros-mcus": "..."
  },
  "ambiente-de-desenvolvimento": {
    "arduino-ide": "...",
    "plataformIO-vscode": "...",
    "simuladores": "...",
    "outras-possibilidades": "..."
  },
  "fundamentos-de-programacao": {
    "estrutura-do-codigo": "...",
    "descricao-dos-pinos": "...",
    "io-digital": "...",
    "comunicacao-serial": "...",
    "io-analogico": "..."
  },
  "controle-e-protocolos": {
    "pwm": "...",
    "interrupcoes": "...",
    "protocolo-i2c": "...",
    "protocolo-spi": "...",
    "timers-de-hardware": "..."
  },
  "topicos-avancados": {
    "gerenciamento-memoria": "...",
    "modos-de-baixo-consumo": "...",
    "multitarefa-com-freeRTOS": "...",
    "bootloader-e-fuses": "..."
  },
  "projetos-praticos": {
    "semaforo-com-botao": {
      "introducao": "..."
    }
  }
}
```

---

### `noticias/index.ejs`
Listagem de notícias.

| Variável | Tipo | Descrição |
|---|---|---|
| `noticias` | array | Lista de objetos de notícia com `slug`, `nome` e `data` |

---

### `noticias/noticia.ejs`
Notícia individual.

| Variável | Tipo | Descrição |
|---|---|---|
| `noticia` | objeto | Dados da notícia com `nome`, `descricao` e `conteudo` |

> ⚠️ Assim como em `raipedia/raipedia.ejs`, o campo `descricao` aparece duas vezes na view. Isso parece ser um erro de duplicação a ser corrigido.

---

### `processo-seletivo/processo-seletivo.ejs`
Página do processo seletivo. Não recebe variáveis — conteúdo estático.

---

### `contato/contato.ejs`
Página de contato. Não recebe variáveis — conteúdo estático.

---

## Convenções e boas práticas

**Nomenclatura de variáveis** — o padrão usado é o singular para objetos individuais (`membro`, `evento`, `projeto`) e o plural para listas (`membros`, `eventos`, `projetos`). A view `projetos/projeto.ejs` foge desse padrão usando `projetos.nome` em vez de `projeto.nome`, o que deve ser corrigido.

**Profundidade dos includes** — o caminho passado para `include()` é sempre relativo ao arquivo atual. Views dentro de subpastas precisam subir mais níveis:
```ejs
<!-- Em views/quem-somos/membros/membro.ejs -->
<%- include("../../partials/header") %>

<!-- Em views/quem-somos/sobre.ejs -->
<%- include("../partials/header") %>
```

**Views estáticas** — páginas sem dados dinâmicos (como `sobre.ejs`, `contato.ejs`, `processo-seletivo.ejs`) recebem apenas o include do header. Quando essas páginas precisarem de conteúdo dinâmico no futuro, basta adicionar as variáveis no `res.render()` da rota correspondente.

---

*Documentação mantida pelo Time de Mídias RAITec.*
>**Contribuintes**
Gabriel Gonzaga Sá Barreto - Consultor 
