# Clínica Express

API para gerenciamento de usuários de uma clínica.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- TypeORM
- JWT
- bcrypt

## Estrutura

A aplicação foi desenvolvida usando uma abordagem funcional. As camadas são compostas principalmente por funções e closures, evitando o uso de classes para services, controllers, repositories e módulos.

A aplicação está organizada em módulos, separando responsabilidades entre rotas, controllers, services, repositories, entidades, DTOs e middlewares.

## Autenticação e autorização

A autenticação utiliza JWT. As rotas protegidas validam o token através de middleware de autenticação.

A autorização é feita por roles e permissions. O acesso às operações é controlado antes de chegar ao controller.

Também foram implementados middlewares para:

- autenticação
- autorização
- validação dos DTOs
- tratamento centralizado de erros

A aplicação possui erros customizados para situações específicas. Esses erros são tratados pelo middleware central de erros, que também trata os erros de validação.

## Banco de dados

O projeto utiliza PostgreSQL com TypeORM. As alterações do banco são controladas através de migrations.

### PostgreSQL com Docker

O PostgreSQL utilizado pela aplicação deve ser executado através do `docker-compose.yml` presente no projeto.

Após configurar o arquivo `.env`, suba o banco com:

```bash
docker compose up -d
```

O container PostgreSQL deve estar em execução antes de executar as migrations ou utilizar a API.

### Configuração inicial do banco

Após subir o PostgreSQL, execute as migrations:

```bash
npm run migration:run
```

Depois execute o bootstrap do banco:

```bash
npm run seed
```

O `bootstrap.seed.ts` cria as permissions e roles necessárias (`admin`, `user` e `owner`) e cria o usuário administrador inicial. O email e a senha do administrador são definidos pelas variáveis:

```env
INITIAL_ADMIN_EMAIL=admin@email.com
INITIAL_ADMIN_PASSWORD=sua_senha
```

O seed é necessário porque a criação de novos usuários é restrita ao usuário com role `admin`.

## Instalação

```bash
npm install
```

Crie um arquivo `.env` com as configurações do PostgreSQL, JWT e usuário inicial:

```env
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=clinica
JWT_SECRET=sua_chave
INITIAL_ADMIN_EMAIL=admin@email.com
INITIAL_ADMIN_PASSWORD=sua_senha
```

### Ordem de inicialização

Para executar o projeto pela primeira vez, siga esta ordem:

```bash
npm install
docker compose up -d
npm run migration:run
npm run seed
```

Depois, inicie a API:

```bash
npm run dev
```

Para executar a versão compilada:

```bash
npm run build
npm start
```

## Rotas

Atualmente a API possui o módulo de usuários:

```text
POST /users/login
POST /users/register
GET  /users/me
```

O cadastro de usuários exige autenticação e role `admin`.

## Outros comandos

```bash
npm run lint
npm run seed
npm run migration:generate
npm run migration:run
npm run migration:revert
```
