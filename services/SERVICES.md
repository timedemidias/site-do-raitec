# SERVICES.md — Pasta `services/`

Documentação técnica dos serviços externos integrados ao projeto. Atualmente a pasta contém dois arquivos, ambos relacionados ao Firebase.

---

## Visão geral

O projeto usa o Firebase em dois contextos diferentes, com SDKs diferentes, para propósitos diferentes:

| Arquivo | SDK | Propósito |
|---|---|---|
| `firebase.js` | Firebase Client SDK | Autenticação de usuários (login do admin) |
| `firebaseAdmin.js` | Firebase Admin SDK | Acesso ao Firestore (banco de dados) |

É importante entender que os dois arquivos são instâncias separadas e independentes do Firebase. Um não substitui o outro.

---

## `firebase.js` — Client SDK

### Para que serve
Usado exclusivamente para autenticar o usuário administrador via e-mail e senha. A função `signInWithEmailAndPassword` do Firebase Authentication só está disponível no Client SDK, por isso esse arquivo existe separadamente.

### Como funciona
```js
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

const firebaseConfig = { /* configurações públicas do projeto */ };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

module.exports = { auth };
```

O objeto `auth` é exportado e importado em `routes/admin/auth.js` para processar o login:
```js
const { auth } = require("../../services/firebase");
const { signInWithEmailAndPassword } = require("firebase/auth");

await signInWithEmailAndPassword(auth, email, senha);
```

### Sobre as credenciais
As configurações dentro de `firebaseConfig` (apiKey, projectId, etc.) são **públicas por design** — o Firebase Client SDK foi projetado para ser usado no frontend e essas chaves são seguras de expor. O controle de acesso real é feito pelas regras de segurança do Firebase e pelo Firebase Authentication.

---

## `firebaseAdmin.js` — Admin SDK

### Para que serve
Usado em todas as rotas que precisam ler ou escrever dados no Firestore. O Admin SDK roda exclusivamente no servidor, tem acesso irrestrito ao banco e não depende de autenticação de usuário — ele se autentica diretamente com credenciais de serviço.

### Como funciona
```js
require("dotenv").config();
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId:   process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

module.exports = admin.firestore();
```

O módulo exporta diretamente a instância do Firestore (`admin.firestore()`), então qualquer arquivo que importe esse serviço já recebe o `db` pronto para uso:

```js
const db = require("../../services/firebaseAdmin");

// Exemplo de uso
const snapshot = await db.collection("membros").get();
```

### Por que o `.replace(/\\n/g, '\n')`
A chave privada do Firebase contém quebras de linha reais (`\n`). Quando essa chave é armazenada em uma variável de ambiente, essas quebras viram a string literal `\\n`. O `.replace()` converte de volta para quebras de linha reais, que é o formato que o SDK espera.

---

## Variáveis de ambiente

O `firebaseAdmin.js` depende de três variáveis que devem estar em um arquivo `.env` na raiz do projeto. Esse arquivo **não é enviado ao GitHub** (está no `.gitignore`).

```env
FIREBASE_PROJECT_ID=raitec-site
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@raitec-site.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

### Como obter essas credenciais
1. Acesse o [Console do Firebase](https://console.firebase.google.com)
2. Vá em **Configurações do projeto → Contas de serviço**
3. Clique em **Gerar nova chave privada**
4. Um arquivo `.json` será baixado — os três valores acima estão dentro dele

> ⚠️ Nunca commite o arquivo `.env` nem o `.json` de credenciais no repositório. Se isso acontecer acidentalmente, gere uma nova chave imediatamente e revogue a anterior no Console do Firebase.

---

## Coleções do Firestore

Abaixo estão todas as coleções utilizadas atualmente, com os campos conhecidos de cada documento.

### membros
Dados dos integrantes da organização.

| Campo  | Tipo   | Descrição |
|---     |--------|-----------|
| `nome` | string | Nome completo do membro |
| `slug` | string | Identificador único para a URL (ex: `joao-silva`) |
| `foto` | string | URL da foto do membro |
| `eixo` | string | Eixo ao qual pertence (`Técnico`, `Apoio`, `Inovação`) |
| `time` | string | Time ao qual pertence (`Mídias`, `Processos`) |
| `descricao` | string | Texto de apresentação do membro |
| `projetos` | array | Lista de projetos nos quais participou |
| `ativo` | boolean | Se o membro está ativo atualmente |
| `coordenador` | array | Lista de escopos que coordena (ex: `["Técnico"]`) |

---

### projetos
Projetos desenvolvidos pela organização.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Nome do projeto |
| `slug` | string | Identificador único para a URL |
| `status` | string | `ativo`, `arquivado` ou `finalizado` |
| `eixo_time` | string | Eixo ou time responsável |
| `descricao` | string | Descrição geral do projeto |
| `objetivo` | string | Objetivo principal |
| `problema` | string | Problema que o projeto resolve |
| `justificativa` | string | Por que o projeto foi feito |
| `funcionamento` | string | Como o sistema funciona |
| `logica` | string | Lógica técnica por trás do projeto |
| `fluxo` | array | Etapas do funcionamento (objetos com `titulo` e `descricao`) |
| `componentes` | array | Lista de componentes de hardware utilizados |
| `tecnologias` | array | Tecnologias usadas (objetos com `nome` e `tipo`) |
| `linguagens` | array | Linguagens de programação utilizadas |
| `membros` | array | Membros que participaram do projeto |
| `imagens` | array | URLs de imagens do projeto |
| `video` | string | URL de vídeo demonstrativo |
| `resultados` | string | Resultados obtidos |
| `melhorias` | array | Melhorias futuras planejadas |
| `aplicacoes` | array | Possíveis aplicações do projeto |
| `duracao` | string | Duração do projeto |
| `data` | string | Data de criação ou conclusão |
| `linkGithub` | string | Link para o repositório |

---

### eventos
Eventos realizados ou futuros.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Nome do evento |
| `slug` | string | Identificador único para a URL |
| `descricao` | string | Descrição do evento |

---

### extensao
Ações de extensão da organização.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Nome da ação de extensão |
| `slug` | string | Identificador único para a URL |
| `descricao` | string | Descrição da ação |

---

### noticias
Notícias publicadas no site.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Título da notícia |
| `slug` | string | Identificador único para a URL |
| `data` | string | Data de publicação |
| `descricao` | string | Resumo da notícia |
| `conteudo` | string | Conteúdo completo da notícia |

---

### raipedia
Artigos e capacitações da Raipédia.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Título do artigo |
| `slug` | string | Identificador único para a URL |
| `descricao` | string | Resumo do artigo |
| `conteudo` | string | Conteúdo completo |
| `categoria` | string | Categoria do artigo — determina qual view será usada (ex: `microcontroladores`) |

> A categoria `microcontroladores` usa uma view especial com layout de documentação técnica e sidebar de navegação. Artigos dessa categoria têm uma estrutura de campos mais complexa com subchaves aninhadas (ex: `o-que-e.historia`, `fundamentos-de-programacao.estrutura-do-codigo`).

---

### eixos
Eixos da estrutura organizacional.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Nome do eixo (ex: `Técnico`) |
| `descricao` | string | Descrição do eixo |

> O ID do documento no Firestore é usado diretamente como parâmetro na URL (`/eixos/:slug`), então ele deve ser um identificador legível (ex: `tecnico`).

---

### times
Times da estrutura organizacional.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Nome do time (ex: `Mídias`) |
| `descricao` | string | Descrição do time |

> Mesma convenção dos eixos: o ID do documento é usado na URL (`/times/:slug`).

---

## Padrão de consulta ao Firestore

Existem dois padrões principais usados nas rotas para buscar dados:

### Buscar todos os documentos de uma coleção
```js
const snapshot = await db.collection("membros").get();

const membros = [];
snapshot.forEach(doc => {
  membros.push(doc.data());
  // ou, para incluir o ID: membros.push({ id: doc.id, ...doc.data() })
});
```

### Buscar um documento específico por campo (slug)
```js
const snapshot = await db.collection("membros")
  .where("slug", "==", slug)
  .get();

if (snapshot.empty) {
  return res.status(404).send("Não encontrado");
}

const membro = snapshot.docs[0].data();
```

### Buscar um documento pelo ID direto
```js
const doc = await db.collection("eixos").doc(req.params.slug).get();

if (!doc.exists) {
  return res.status(404).send("Não encontrado");
}

const eixo = { id: doc.id, ...doc.data() };
```

---

*Documentação mantida pelo Time de Mídias RAITec.*
>**Contribuintes**
Gabriel Gonzaga Sá Barreto - Consultor 