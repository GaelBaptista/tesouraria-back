# Tesouraria Back-end

API backend para o sistema de gestão de tesouraria de igrejas.

## Requisitos

- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

## Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

Crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente. Você pode usar o `.env.example` como referência:

```bash
cp .env.example .env
```

**Variáveis necessárias:**

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=tesouraria

# Server
PORT=3333

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d
```

### 3. Criar banco de dados

```bash
# Com psql
createdb tesouraria
```

### 4. Rodar migrations

```bash
npm run migrate:dev
```

Ou para resetar o banco (cuidado - apaga tudo):

```bash
npm run migrate:reset
```

## Iniciar servidor

### Desenvolvimento

```bash
npm run dev
```

Ao subir a API, as migrations pendentes passam a ser aplicadas automaticamente.

O servidor estará disponível em `http://localhost:3333/api`

### Produção

```bash
npm run build
npm run start
```

## Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Contas Bancárias

- `GET /api/accounts` - Listar contas
- `POST /api/accounts` - Criar conta
- `DELETE /api/accounts/:id` - Deletar conta

### Transações

- `GET /api/lancamentos` - Listar lançamentos (entradas/saídas)
- `POST /api/lancamentos` - Criar lançamento
- `DELETE /api/lancamentos/:id` - Deletar lançamento

### Contas a Pagar

- `GET /api/pagamentos` - Listar contas a pagar
- `POST /api/pagamentos` - Criar conta a pagar
- `PUT /api/pagamentos/:id` - Atualizar conta a pagar
- `DELETE /api/pagamentos/:id` - Deletar conta a pagar

### Usuários

- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário

### Configurações

- `GET /api/configuracoes` - Obter configurações (missões)
- `PATCH /api/configuracoes` - Atualizar configurações

## Estrutura do Projeto

```
src/
├── controllers/      # Controladores das rotas
├── entities/        # Modelos do banco de dados
├── middlewares/     # Middlewares (autenticação)
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── utils/           # Utilitários (JWT)
└── db/              # Configuração do banco
    ├── data-source.ts    # Configuração do TypeORM
    ├── migrate.ts        # Script de migração
    └── migrations/       # Arquivos de migração
```

## Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header `Authorization`:

```
Authorization: Bearer seu_token_aqui
```

## Tipos de Dados

### User

```typescript
{
  id: string (UUID)
  name: string
  username: string
  role: "Administrador" | "Tesoureiro" | "Observador"
  email?: string
  churchName?: string
  pastorName?: string
}
```

### BankAccount

```typescript
{
  id: string (UUID)
  name: string
  bankName?: string
  type: string
  initialBalance: number
}
```

### Transaction

```typescript
{
  id: string (UUID)
  type: "INCOME" | "EXPENSE" | "TRANSFER"
  value: number
  date: string (YYYY-MM-DD)
  description: string
  category: string
  accountId: string (UUID)
  toAccountId?: string (para transferências)
  isRecurring?: boolean
  userId: string (UUID de quem criou)
}
```

### Bill

```typescript
{
  id: string (UUID)
  description: string
  value: number
  dueDate: number (dia do mês: 1-31)
  category: string
  isRecurring: boolean
  status: "Pendente" | "Pago" | "Atrasado"
  lastPaymentDate?: string
}
```

## CORS

CORS está habilitado por padrão para permitir requisições do frontend. Configure conforme necessário em `server.ts`.

## Dúvidas?

Consulte a documentação da API ou verifique os exemplos nos controllers.
