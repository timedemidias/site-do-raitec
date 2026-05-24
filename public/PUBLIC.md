# PUBLIC.md — Pasta `public/`

Documentação técnica dos arquivos estáticos do projeto. Esta pasta contém tudo que é servido diretamente ao navegador sem passar por nenhuma rota do Express — CSS, JavaScript de frontend e imagens.

---

## Como o Express serve arquivos estáticos

O `index.js` registra a pasta `public/` como diretório estático:

```js
app.use(express.static(path.join(__dirname, "public")));
```

Isso significa que qualquer arquivo dentro de `public/` fica acessível diretamente pelo navegador usando o caminho a partir de `public/` como raiz. Por exemplo:

| Arquivo no disco | URL no navegador |
|---|---|
| `public/css/header.css` | `/css/header.css` |
| `public/css/admin.css` | `/css/admin.css` |
| `public/images/logo.webp` | `/images/logo.webp` |

Nas views EJS, os arquivos são referenciados sempre com esse caminho a partir da raiz:

```html
<link rel="stylesheet" href="/css/header.css">
```

---

## Estrutura de pastas

```
public/
│
├── css/
│   ├── header.css        # Estilos do menu de navegação
│   ├── style.css         # Estilos gerais / página inicial
│   ├── login.css         # Estilos da tela de login
│   └── admin.css         # Estilos do painel administrativo
│
├── js/                   # Pasta reservada para scripts de frontend (atualmente vazia)
│
└── images/
    └── logo.webp         # Logotipo do RAITec
```

---

## Arquivos CSS

### `header.css`
Estiliza o menu de navegação principal do site. É carregado diretamente dentro do `views/partials/header.ejs`, então ele é incluído automaticamente em todas as páginas que usam o partial.

**O que estiliza:**
- A barra de navegação (`.menu`) com fundo azul escuro (`#05053f`)
- Os itens do menu alinhados à direita em flex
- O efeito hover nos links com fundo ciano (`#09cccc`)
- O submenu do "Quem Somos" (`.dropdown` e `.submenu`) que aparece no hover

**Lógica do submenu:**
O submenu fica oculto por padrão com `display: none` e aparece via CSS puro quando o elemento pai `.dropdown` recebe hover — sem nenhum JavaScript envolvido:

```css
.dropdown:hover > .submenu {
  display: block;
}
```

**Onde é carregado:**
```ejs
<!-- Dentro de views/partials/header.ejs -->
<link rel="stylesheet" href="/css/header.css">
```

---

### `style.css`
Estilos gerais usados na página inicial do site. Define o layout centralizado com fundo escuro e o container principal.

**O que estiliza:**
- Reset global de margin, padding e box-sizing
- Body com `height: 100vh`, fundo `#05053f` e flexbox centralizado
- `.container` com fundo semitransparente ciano, bordas arredondadas e padding generoso
- `.logo` com largura de 140px
- `#mensagem` com fonte grande em cor clara
- `.subtitulo` em ciano e `.texto` em cinza claro

**Onde é carregado:**
Atualmente não há um `<link>` explícito para esse arquivo nas views — ele pode estar sem uso ativo ou ser referenciado em alguma view não listada nos arquivos do projeto. Vale verificar e adicionar o link na `views/index.ejs` se necessário.

---

### `login.css`
Estiliza a tela de login do painel administrativo (`views/auth/login.ejs`).

**O que estiliza:**
- Reset global e body centralizado com fundo `#05053f`
- `.login-box` em branco com sombra, bordas arredondadas e largura de 400px
- Grupos de input (`.input-group`) com label e campo de texto estilizados
- Botão de submit com fundo azul escuro e hover que muda para ciano

**Onde é carregado:**
```html
<!-- Dentro de views/auth/login.ejs -->
<link rel="stylesheet" href="/css/login.css">
```

---

### `admin.css`
O maior arquivo CSS do projeto. Estiliza todo o painel administrativo — dashboard, listagens, formulários, cards e tabelas.

**O que estiliza:**

- **Reset e body** — fundo em gradiente claro (`#f8faff` → `#eef2ff`)
- **`.admin-header`** — barra superior do painel com fundo `#05053f`, título à esquerda e botão de logout à direita
- **`.admin-container`** — área de conteúdo centralizada com padding e largura máxima de 1400px
- **Botões** — três variantes: `.btn-primary` (azul escuro), `.btn-secondary` (ciano), `.btn-danger` (vermelho). Todos com hover de elevação via `translateY`
- **`.admin-grid`** — grid responsivo com `auto-fit` e mínimo de 300px por coluna
- **`.card`** — cards brancos com sombra, borda arredondada, linha decorativa no topo via `::before` em gradiente azul→ciano, e efeito hover de elevação
- **`.page-header`** — cabeçalho de cada página admin com título e botão de ação lado a lado
- **`.card-actions`** — grupo de botões dentro dos cards (editar/excluir)
- **Formulários** — `.admin-form`, `.form-group`, inputs, selects e textareas com foco em ciano
- **`.admin-list` e `.admin-item`** — listagem em coluna com cards de item individuais
- **`.membro-foto`** — avatar circular com borda ciano
- **`.status`** — badges coloridos para status ativo/inativo
- **`.admin-table`** — tabela com cabeçalho azul escuro e linhas separadas
- **Responsivo** — abaixo de 768px, o header empilha verticalmente, o container reduz padding e os itens de lista mudam para coluna

**Onde é carregado:**
```ejs
<!-- Dentro de views/admin/membros/index.ejs -->
<link rel="stylesheet" href="/css/admin.css">

<!-- Dentro de views/admin/index.ejs -->
<link rel="stylesheet" href="/css/admin.css">
```

> ⚠️ O `admin.css` não é carregado via partial — cada view do admin precisa incluir o link manualmente. Se uma nova view admin for criada, lembrar de adicionar o `<link>` no `<head>`.

---

## Paleta de cores

Todos os arquivos CSS do projeto compartilham a mesma paleta:

| Cor | Hex | Uso |
|---|---|---|
| Azul escuro | `#05053f` | Fundo principal, headers, botão primário |
| Ciano | `#09cccc` | Destaques, hover, botão secundário, bordas de foco |
| Vermelho | `#d62828` / `#dc3545` | Botão de exclusão / ações destrutivas |
| Branco | `#ffffff` | Fundo de cards e formulários |
| Cinza claro | `#f5f7fb` / `#f8faff` | Fundo de páginas admin |
| Cinza texto | `#666` | Textos secundários |

---

## Imagens

### `images/logo.webp`
Logotipo do RAITec em formato WebP. O formato WebP oferece melhor compressão que PNG ou JPG mantendo qualidade visual.

Referenciado nas views como:
```html
<img src="/images/logo.webp" alt="RAITec" class="logo">
```

---

## Boas práticas para novos arquivos

**Novo CSS para uma seção específica** — criar um arquivo separado em `public/css/` com o nome da seção (ex: `projetos.css`) e incluir o `<link>` manualmente nas views que precisam dele.

**Novo CSS global** — se o estilo se aplicar a múltiplas páginas, considerar adicioná-lo ao `style.css` ou criar um `global.css` e incluí-lo no `header.ejs` para que seja carregado automaticamente em todas as páginas.

**Imagens** — colocar sempre em `public/images/`. Preferir WebP para fotos e SVG para ícones e logotipos. Evitar nomes com espaços ou acentos no nome do arquivo.

**Scripts de frontend** — quando houver JavaScript para rodar no navegador (não no servidor), colocar em `public/js/` e incluir com `<script src="/js/arquivo.js">` no final do `<body>` das views que precisarem.

---

*Documentação mantida pelo Time de Mídias RAITec.*
>**Contribuintes**
Gabriel Gonzaga Sá Barreto - Consultor 
