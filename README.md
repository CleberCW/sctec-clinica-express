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

## Instalação

```bash
npm install
```

Crie um arquivo `.env` com as configurações do PostgreSQL:

```env
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=clinica
```

Execute as migrations:

```bash
npm run migration:run
```

Para iniciar em desenvolvimento:

```bash
npm run dev
```

Para executar a versão compilada:

```bash
npm run build
npm start
```

## Rotas

Atualmente a API possui o módulo de usuários em:

```text
/users
```

## Outros comandos

```bash
npm run lint
npm run seed
npm run migration:generate
npm run migration:revert
```
