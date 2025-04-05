# Documentação - Sistema de Autenticação de Gestores

## Objetivo
Este documento descreve as alterações e implementações realizadas no sistema de autenticação de gestores, incluindo a configuração do ambiente de testes e as correções necessárias para garantir o funcionamento correto do sistema.

## Estrutura do Sistema

### 1. Banco de Dados (SQLite)
- Banco de dados SQLite utilizado para testes
- Arquivo de banco de dados separado para ambiente de teste (`db.test.sqlite`)
- Configuração para drop do schema em ambiente de teste

### 2. Entidades
- `UserBase`: Entidade base para usuários
- `Manager`: Entidade específica para gestores, que herda de UserBase

### 3. Migrations
- Utiliza a mesma migração que cria a tabela `user-base`
- A entidade Manager herda automaticamente todas as colunas da UserBase

### 4. Testes
- Testes localizados em `src/tests/managerLogin.test.ts`
- Testes implementados:
  1. `deve retornar 200 e dados do gestor com email e senha válidos`
     - Verifica login bem-sucedido usando email
     - Valida retorno do status 200
     - Verifica dados do gestor retornados
  
  2. `deve retornar 401 com email ou senha inválidos`
     - Verifica falha no login
     - Valida retorno do status 401
     - Verifica mensagem de erro

### 5. Configuração do Ambiente de Testes
- Configuração do banco de dados em `src/database/config.ts`:
  - Drop do schema em ambiente de teste
  - Limpeza do arquivo do banco de dados entre testes
  - Sincronização automática do banco de dados
  
- Configuração do ambiente de teste:
  - Criação de dados de teste para gestor
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
   - Validação de email e senha
   - Retorno de mensagens de erro apropriadas

### 7. Como Executar os Testes
```bash
npm test
```

### 8. Resultados Esperados
- Teste de login bem-sucedido deve retornar status 200 e dados do gestor
- Teste de login falhado deve retornar status 401 e mensagem de erro
- Ambiente de teste deve ser limpo após cada execução

## Diferenças em Relação aos Outros Sistemas
1. **Método de Autenticação**:
   - Gestores: autenticam-se usando email e senha
   - Atletas: autenticam-se usando CPF e senha
   - Professores: autenticam-se usando email e senha

2. **Campos Específicos**:
   - Gestores: herdam todos os campos da UserBase
   - Não possuem campos específicos adicionais

3. **Validações**:
   - Gestores: validação de email
   - Atletas: validação de CPF
   - Professores: validação de email

## Credenciais de Teste
- Email: `test@gerente.com`
- Senha: `123456`
- CPF: `12345678901`
- RG: `123456789`
- Telefone: `11999999999`
- Data de Nascimento: `1980-01-01`
- Role: `1` (Gerente)

## Endpoints

### Login
**POST /api/v1/auth/manager/login**

#### Request Body
```json
{
    "email": "test@gerente.com",
    "password": "123456"
}
```

#### Response
```json
{
    "success": true,
    "data": {
        "accessToken": "string",
        "manager": {
            "id": number,
            "name": string,
            "email": string,
            "cpf": string,
            "rg": string,
            "birthday": string,
            "phone": string,
            "photo_url": string,
            "role": number
        }
    }
}
```

## Como Testar
1. Certifique-se de que o servidor está rodando
2. Use as credenciais de teste
3. O token JWT retornado deve ser armazenado para uso em requisições subsequentes
4. O frontend deve redirecionar para `/home-gerente` após login bem-sucedido

## Erros Comuns
- **401 Unauthorized**: Credenciais incorretas
- **404 Not Found**: Rota incorreta
- **500 Internal Server Error**: Problema no servidor

## Observações
- O CPF deve ser enviado sem pontos e traços
- O token JWT tem validade de 30 minutos
- O frontend deve fazer requisições para `http://localhost:5173/api/v1/auth/manager`

## Considerações Finais
As alterações implementadas garantem um sistema de autenticação robusto e testável para gestores, mantendo a consistência com os sistemas de atletas e professores. O código está pronto para ser integrado ao sistema principal e pode servir de base para implementações futuras de autenticação.
