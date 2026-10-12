# 1. Fluxo correto da equipe

## Atualizar a development

Antes de começar qualquer tarefa:

```bash
git checkout development
git pull origin development
```


## Entrar na branch da funcionalidade

Exemplo:

```bash
git checkout feature/membros
```


## Fazer alterações no código

Após modificar arquivos:

```bash
git add .
```


## Criar commit

Exemplo:

```bash
git commit -m "feat: adiciona CRUD de membros"
```


## Enviar alterações

```bash
git push origin feature/membros
```



# 2. Fluxo de integração do projeto

O fluxo correto do projeto é:

```txt
feature/* -> development -> main
```




# 3. Conferir branch atual

```bash
git branch
```

A branch atual aparecerá com:

```txt
*
```


# 4. Trocar de branch

```bash
git checkout nome-da-branch
```



## Exemplo

```bash
git checkout feature/admin
```



# 5. Verificar alterações

```bash
git status
```



# 6. Atualizar projeto local

```bash
git pull origin development
```

