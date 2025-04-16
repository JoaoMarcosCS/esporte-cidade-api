# Uso do Sistema de Autenticação do Professor

## Endpoints

### Login
**POST /api/v1/auth/teacher/login**

#### Request Body
```json
{
    "email": "string",
    "password": "string"
}
```

#### Response
```json
{
    "success": true,
    "data": {
        "accessToken": "string",
        "teacher": {
            "id": number,
            "name": string,
            "email": string,
            "cpf": string,
            "rg": string,
            "birthday": string,
            "phone": string,
            "photo_url": string,
            "about": string,
            "modality": {
                "id": number,
                "name": string,
                "description": string
            },
            "role": number
        }
    }
}
```

## Credenciais de Teste
- Email: `test@professor.com`
- Senha: `123456`

## Como Testar
1. Certifique-se de que o servidor está rodando
2. Use as credenciais de teste
3. O token JWT retornado deve ser armazenado para uso em requisições subsequentes

## Erros Comuns
- **401 Unauthorized**: Credenciais incorretas
- **404 Not Found**: Rota incorreta
- **500 Internal Server Error**: Problema no servidor
