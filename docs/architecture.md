# Arquitetura do Projeto Esporte Cidade API

## Estrutura de Diretórios

```
esporte-cidade-api/
├── src/
│   ├── controllers/        # Controladores das rotas
│   ├── database/           # Configuração do banco de dados
│   ├── repositories/       # Repositórios para acesso aos dados
│   ├── routes/            # Definição das rotas da API
│   ├── services/          # Serviços de negócio
│   └── types/             # Tipos TypeScript
├── tests/                 # Testes da aplicação
└── migrations/            # Migrações do banco de dados
```

## Scripts do Projeto

Os principais scripts disponíveis no projeto são:

```json
{
  "scripts": {
    "dev": "nodemon --watch \"src/\" -r \"tsconfig-paths/register\" --exec \"ts-node src/server.ts\" -e ts --env-file .env",
    "test": "ts-node -r tsconfig-paths/register src/tests/userBase.test.ts",
    "test:watch": "nodemon --watch \"src/\" -r \"tsconfig-paths/register\" --exec \"ts-node src/tests/userBase.test.ts\" -e ts",
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js"
  }
}
```

### Uso dos Scripts

- `npm run dev`: Inicia o servidor em modo de desenvolvimento com hot reload
- `npm run test`: Executa os testes uma vez
- `npm run test:watch`: Executa os testes em modo watch (reexecuta automaticamente quando houver mudanças)
- `npm run typeorm`: Comando para executar comandos do TypeORM

## Serviços (Services)

Os serviços são responsáveis pela lógica de negócio da aplicação. Eles são encontrados no diretório `src/services/` e seguem o padrão de nomeação `NomeDoServico.service.ts`.

Exemplo de estrutura de um serviço:

```typescript
// src/services/athlete-auth.service.ts
import { AthleteRepository } from "../repositories/athlete.repository";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AthleteAuthService {
    constructor(
        private athleteRepository: AthleteRepository
    ) {}

    async authenticate(cpf: string, password: string) {
        // Lógica de autenticação
    }
}
```

## Tipos (Types)

Os tipos TypeScript são definidos no diretório `src/types/` e ajudam a garantir a tipagem forte no projeto.

### Tipos Globais

```typescript
// src/types/express.d.ts
import { Request, Response, NextFunction } from 'express';

export interface AthleteAuth {
    id: number;
    cpf: string;
    role: number;
}

export interface Manager {
    id: number;
    email: string;
    role: number;
}

declare global {
    namespace Express {
        interface Request {
            athlete?: AthleteAuth;
            manager?: Manager;
        }
    }
}
```

## Repositórios (Repositories)

Os repositórios são responsáveis pelo acesso aos dados e estão localizados em `src/repositories/`. Eles implementam o padrão Repository Pattern.

Exemplo de um repositório:

```typescript
// src/repositories/athlete.repository.ts
import { Repository } from "typeorm";
import { Athlete } from "../entities/athlete.entity";

export class AthleteRepository extends Repository<Athlete> {
    async findByCpf(cpf: string): Promise<Athlete | null> {
        return this.findOne({ where: { cpf } });
    }

    async createAthlete(data: Partial<Athlete>): Promise<Athlete> {
        return this.save(this.create(data));
    }
}
```

## Migrações

As migrações do banco de dados estão localizadas no diretório `migrations/` e são gerenciadas pelo TypeORM.

### Comandos úteis para migrações:

```bash
# Criar uma nova migração
npm run typeorm migration:create -n NomeDaMigracao

# Executar todas as migrações pendentes
npm run typeorm migration:run

# Reverter a última migração
npm run typeorm migration:revert

# Verificar o status das migrações
npm run typeorm migration:show
```

## Banco de Dados

O projeto utiliza SQLite como banco de dados de desenvolvimento, configurado no arquivo `src/database/config.ts`.

### Configuração do Banco de Dados

```typescript
// src/database/config.ts
import { DataSource } from "typeorm";
import { Athlete } from "../entities/athlete.entity";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    synchronize: true,
    logging: true,
    entities: [Athlete],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
});

export const initializeDatabase = async () => {
    await AppDataSource.initialize();
};
```

## Padrões de Projeto

1. **Repository Pattern**: Separação clara entre a lógica de negócio e o acesso aos dados
2. **Service Layer**: Centralização da lógica de negócio
3. **Controller Layer**: Gerenciamento das rotas e requisições HTTP
4. **Type Safety**: Uso extensivo de TypeScript para garantir segurança de tipos

## Melhores Práticas

1. **Tipagem**: Sempre use tipos explícitos e interfaces para manter a consistência
2. **Error Handling**: Use try/catch em serviços e controllers para tratamento de erros
3. **Logging**: Adicione logs em pontos importantes para facilitar o debug
4. **Validation**: Valide dados de entrada antes de processá-los
5. **Security**: Nunca expoe dados sensíveis (senhas, tokens) em logs ou respostas

## Testes

Os testes estão localizados em `src/tests/` e seguem a estrutura:

```typescript
// src/tests/userBase.test.ts
describe('User Base Tests', () => {
    let athleteRepository: AthleteRepository;

    beforeEach(async () => {
        await AppDataSource.initialize();
        athleteRepository = AppDataSource.getRepository(Athlete);
    });

    afterEach(async () => {
        await AppDataSource.destroy();
    });

    it('should create a new athlete', async () => {
        // Teste de criação de atleta
    });
});
```

## Contribuição

1. Faça fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add some feature'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request
