# Fluxo Git da Equipe

# 1. Comandos básicos do Git

```bash
git fetch origin → ver novidades do GitHub

git branch → ver branches locais

git branch -a → ver todas as branches

git checkout nome-da-branch → trocar de branch
```

---

# 2. Fluxo da equipe

Todos os membros iniciam clonando a branch `main`.

Depois disso, cada pessoa trabalhará apenas na branch da funcionalidade designada.

---

## Atualizar informações do GitHub

Antes de começar qualquer tarefa:

```bash
git fetch origin
```

---

## Verificar branches existentes

```bash
git branch -a
```

---

## Entrar na branch da funcionalidade

Exemplo:

```bash
git checkout feature/membros
```

---

## Conferir branch atual

```bash
git branch
```

A branch atual aparecerá com:

```txt
*
```

Exemplo:

```txt
* feature/membros
```

---

# 3. Fluxo de desenvolvimento

Após entrar na branch correta:

## Fazer alterações no código

Editar arquivos normalmente.

---

## Verificar alterações realizadas

```bash
git status
```

---

## Adicionar arquivos modificados

```bash
git add .
```

---

## Criar commit

Exemplo:

```bash
git commit -m "feat: adiciona CRUD de membros"
```

---

## Enviar alterações para o GitHub

```bash
git push origin feature/membros
```

---

# 4. Fluxo de integração do projeto

O fluxo oficial do projeto será:

```txt
feature/* → development → main
```

---

# 5. Explicação do fluxo

## feature/*

Branches de funcionalidades.

Exemplos:

```txt
feature/membros
feature/admin
feature/raipedia
```

Cada membro desenvolve separadamente na sua branch.

---

## development

Branch de integração da equipe.

Todas as funcionalidades finalizadas serão unidas nela para testes.

---

## main

Branch principal do projeto.

Apenas versões estáveis e prontas para produção devem chegar nela.