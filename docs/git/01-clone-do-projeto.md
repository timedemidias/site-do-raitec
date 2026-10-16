# 1. Clonando o projeto

## Clonar o repositório

```bash
git clone https://github.com/raitec-site/Backend.git
```

## Entrar na pasta do projeto

```bash
cd raitec-site
```




# 2. Instalar dependências

```bash
npm install
```

## Instalar nodemon

```bash
npm install -g nodemon
```




# 3. Configuração do Firebase

## Criar a pasta `.config`

Crie a pasta:

```txt
.config
```




## Adicionar o arquivo `serviceAccountKey.json`

Dentro da pasta `.config`, adicionar o arquivo:

```txt
serviceAccountKey.json
```

O código está disponível no Notion do projeto.



## Criar o arquivo `.env`

Criar um arquivo:

```txt
.env
```

na raiz do projeto.

Adicionar as variáveis de ambiente disponíveis no Notion.



# 5. Rodando o projeto

## Rodar com nodemon

```bash
nodemon index.js
```


## O que é o nodemon?

O `nodemon` reinicia automaticamente o servidor sempre que você altera o código.

Isso evita precisar parar e iniciar o servidor manualmente a cada modificação.



# 6. Acessar no navegador

```txt
http://localhost:3000
```

