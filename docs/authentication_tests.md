# Documentação - Sistema de Autenticação de Atletas

## Objetivo
Este documento descreve as alterações e implementações realizadas no sistema de autenticação de atletas, incluindo a configuração do ambiente de testes e as correções necessárias para garantir o funcionamento correto do sistema.

## Estrutura do Sistema

### 1. Banco de Dados (SQLite)
- Banco de dados SQLite utilizado para testes
- Arquivo de banco de dados separado para ambiente de teste (`db.test.sqlite`)
- Configuração para drop do schema em ambiente de teste

### 2. Entidades
- `UserBase`: Entidade base para usuários
- `Athlete`: Entidade específica para atletas, que herda de UserBase

### 3. Migrations
- Migração `CreateUserBaseTable1680714600000`:
  - Criação da tabela `user-base` com as seguintes colunas:
    - id (chave primária, autoincrement)
    - name (texto)
    - password (texto)
    - cpf (texto, 11 caracteres)
    - rg (texto, opcional)
    - birthday (texto)
    - phone (texto)
    - photo_url (texto, opcional)
    - email (texto, único, opcional)
    - role (inteiro)
    - created_at (timestamp)
    - updated_at (timestamp)
  - Verificação de existência da tabela antes da criação
  - Drop da tabela em caso de rollback

### 4. Testes
- Testes localizados em `src/tests/userBase.test.ts`
- Testes implementados:
  1. `deve retornar 200 e dados do atleta com CPF e senha válidos`
     - Verifica login bem-sucedido
     - Valida retorno do status 200
     - Verifica dados do atleta retornados
  
  2. `deve retornar 401 com CPF ou senha inválidos`
     - Verifica falha no login
     - Valida retorno do status 401
     - Verifica mensagem de erro

### 5. Configuração do Ambiente de Testes
- Configuração do banco de dados em `src/database/config.ts`:
  - Drop do schema em ambiente de teste
  - Limpeza do arquivo do banco de dados entre testes
  - Sincronização automática do banco de dados
  
- Configuração do ambiente de teste:
  - Criação de dados de teste para atleta
  - Hashing de senha antes do salvamento
  - Limpeza de dados após cada teste

### 6. Melhorias Implementadas
1. **Tratamento de Erros**:
   - Adição de try/catch em todos os pontos críticos
   - Logs de erro detalhados
   - Tratamento adequado de erros de banco de dados

2. **Limpeza do Ambiente**:
   - Deleção do arquivo do banco de dados entre testes
   - Drop do schema em ambiente de teste
   - Limpeza de dados após cada teste

3. **Segurança**:
   - Hashing de senhas usando bcrypt
   - Validação de CPF e senha
   - Retorno de mensagens de erro apropriadas

### 7. Como Executar os Testes
```bash
npm test
```

### 8. Resultados Esperados
- Teste de login bem-sucedido deve retornar status 200 e dados do atleta
- Teste de login falhado deve retornar status 401 e mensagem de erro
- Ambiente de teste deve ser limpo após cada execução

## Considerações Finais
As alterações implementadas garantem um sistema de autenticação robusto e testável, com tratamento adequado de erros e limpeza automática do ambiente de teste. O código está pronto para ser integrado ao sistema principal e pode servir de base para implementações futuras de autenticação.
