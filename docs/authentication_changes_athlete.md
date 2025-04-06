# Documentação das Alterações na Autenticação

## 1. Configuração do Servidor

### Mudança de Porta
- O servidor foi configurado para rodar na porta 5173 (anteriormente estava na porta 3000)
- O frontend continua na porta 3000
- Arquivo modificado: `.env`

### Logs de Debug
- Adicionados logs detalhados no serviço de autenticação para facilitar o debug
- Logs mostram:
  - CPF sendo usado para autenticação
  - Se o atleta foi encontrado no banco de dados
  - Resultado da verificação de senha

## 2. Frontend

### Configuração da API
- Criado arquivo `src/services/api.ts` para configurar a instância do axios
- Base URL configurada para `http://localhost:5173`

### Serviço de Autenticação
- Criado arquivo `src/services/auth.ts` com a função `loginAthlete`
- Implementada lógica de tratamento de erros e salvamento de token

### Atualização do Login
- Componente `LoginAtleta.tsx` atualizado para:
  - Remover pontos e traços do CPF antes de enviar
  - Fazer requisição real para a API
  - Salvar token e dados do atleta no localStorage
  - Exibir mensagens de erro em português

## 3. Backend

### Mensagens de Erro
- Todas as mensagens de erro foram traduzidas para português:
  - "CPF não encontrado" - quando o CPF não existe no banco de dados
  - "Senha inválida" - quando a senha está incorreta
  - "CPF e senha são obrigatórios" - quando os campos não são preenchidos
  - "Erro ao processar autenticação" - para erros gerais

### Testes
- Atualizados os testes de autenticação para verificar as novas mensagens em português
- Adicionados testes específicos para verificar o comportamento com CPF inválido

## 4. Requisitos de Login

### Dados do Teste
- CPF: `12345678901`
- Senha: `123456`

### Pontos Importantes
- O frontend deve fazer requisições para `http://localhost:5173/api/v1/auth/athlete`
- O CPF deve ser enviado sem pontos e traços
- O token e dados do atleta são salvos no localStorage após login bem-sucedido
- O frontend deve redirecionar para `/home-atleta` após login bem-sucedido
