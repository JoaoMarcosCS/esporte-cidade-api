# Documentação - Sistema de Autenticação de Professores

## Objetivo
Este documento descreve as alterações e implementações realizadas no sistema de autenticação de professores, incluindo a configuração do ambiente de testes e as correções necessárias para garantir o funcionamento correto do sistema.

## Estrutura do Sistema

### 1. Banco de Dados (SQLite)
- Banco de dados SQLite utilizado para testes
- Arquivo de banco de dados separado para ambiente de teste (`db.test.sqlite`)
- Configuração para drop do schema em ambiente de teste

### 2. Entidades
- `UserBase`: Entidade base para usuários
- `Teacher`: Entidade específica para professores, que herda de UserBase
  - Campo adicional: `about` (sobre o professor)
  - Relacionamento com `Modality` (modalidade)

### 3. Migrations
- Utiliza a mesma migração que cria a tabela `user-base`
- A entidade Teacher herda automaticamente todas as colunas da UserBase
- Adição do campo `about` específico para professores

### 4. Testes
- Testes localizados em `src/tests/teacherLogin.test.ts`
- Testes implementados:
  1. `deve retornar 200 e dados do professor com email e senha válidos`
     - Verifica login bem-sucedido usando email
     - Valida retorno do status 200
     - Verifica dados do professor retornados
  
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
  - Criação de dados de teste para professor
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
- Teste de login bem-sucedido deve retornar status 200 e dados do professor
- Teste de login falhado deve retornar status 401 e mensagem de erro
- Ambiente de teste deve ser limpo após cada execução

## Diferenças em Relação ao Sistema de Atletas
1. **Método de Autenticação**:
   - Atletas: autenticam-se usando CPF e senha
   - Professores: autenticam-se usando email e senha

2. **Campos Específicos**:
   - Professores possuem campo `about` para descrição
   - Professores têm relacionamento com modalidades
   - Atletas não possuem esses campos específicos

3. **Validações**:
   - Professores: validação de email
   - Atletas: validação de CPF

## Considerações Finais
As alterações implementadas garantem um sistema de autenticação robusto e testável para professores, mantendo a consistência com o sistema de atletas mas com as adaptações necessárias para o perfil específico de professor. O código está pronto para ser integrado ao sistema principal e pode servir de base para implementações futuras de autenticação.
