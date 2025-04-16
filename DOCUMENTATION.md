# Esporte Cidade - Documentação do Sistema

## Estrutura do Projeto

O projeto está dividido em duas partes principais:
- `esporte-cidade-api`: Backend em Node.js com TypeScript
- `esporte-cidade-front`: Frontend em React com TypeScript

## Configuração do Ambiente

### Backend (esporte-cidade-api)
1. Servidor roda na porta 5173
2. Todas as rotas da API estão sob o prefixo `/api/v1`
3. Para iniciar:
   ```bash
   cd esporte-cidade-api
   npm run dev
   ```

### Frontend (esporte-cidade-front)
1. Servidor roda na porta 3000
2. Para iniciar:
   ```bash
   cd esporte-cidade-front
   npm start
   ```

## Estrutura da API

### Endpoints Principais

1. **Autenticação**
   - Login do Professor: `POST /api/v1/auth/teacher/login`
   - Login do Atleta: `POST /api/v1/auth/athlete/login`

2. **Professores**
   - Buscar Professor: `GET /api/v1/teachers/:id`
   - Atualizar Professor: `PUT /api/v1/teachers/:id`

3. **Agendamentos**
   - Listar Agendamentos do Professor: `GET /api/v1/schedule/teacher/:id`
   - Criar Agendamentos: `POST /api/v1/schedule/teacher/:id`
   - Deletar Agendamento: `DELETE /api/v1/schedule/:id`

## Componentes Principais do Frontend

### AuthContext (`src/contexts/AuthContext.tsx`)
- Gerencia autenticação e estado do usuário
- Armazena token JWT no localStorage
- Decodifica token para obter informações do usuário
- Faz requisições autenticadas para a API

### VisualizarAtendimentos (`src/components/Atendimentos-professor.tsx`)
- Exibe agendamentos do professor
- Organiza em duas seções: "Aulas de Hoje" e "Aulas de Amanhã"
- Usa carrossel para navegação entre agendamentos
- Atualiza automaticamente a cada 60 segundos

## Configuração do Axios

O arquivo `src/services/api.ts` configura o cliente Axios com:
- Base URL: `http://localhost:5173/api/v1`
- Interceptors para:
  - Adicionar token de autenticação
  - Tratar erros de autenticação
  - Redirecionar para login quando necessário

## Correções Recentes

1. **Correção de URLs Duplicadas**
   - Problema: URLs com `/api/v1` duplicado devido à configuração do baseURL
   - Solução: Removido prefixo `/api/v1` dos endpoints nos componentes
   - Arquivos afetados:
     - `src/contexts/AuthContext.tsx`
     - `src/components/Atendimentos-professor.tsx`

2. **Melhoria no Layout**
   - Atualizado layout do componente VisualizarAtendimentos
   - "Aulas de Amanhã" agora aparece abaixo de "Aulas de Hoje"
   - Mantido carrossel para cada seção
   - Adicionado espaçamento entre seções

## Boas Práticas

1. **Autenticação**
   - Sempre use o AuthContext para operações autenticadas
   - Não armazene dados sensíveis no localStorage além do token

2. **Requisições API**
   - Use o cliente Axios configurado em `src/services/api.ts`
   - Não adicione `/api/v1` nos endpoints (já está no baseURL)

3. **Tratamento de Erros**
   - Implemente try/catch em todas as operações assíncronas
   - Use o console.log para debug em desenvolvimento

## Testes

### Dados de Teste
- Professor de teste:
  - Email: test@professor.com
  - Senha: (definida no script create-test-teacher.ts)

### Scripts de Teste
1. `create-test-teacher.ts`: Cria professor para testes
2. `add-test-schedule.ts`: Adiciona agendamentos de teste

## Próximos Passos

1. Implementar testes automatizados
2. Melhorar feedback de erros para o usuário
3. Adicionar paginação para listas longas
4. Implementar cache de dados no frontend
