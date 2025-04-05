# Função para fazer requisições HTTP
function Invoke-ApiRequest {
    param(
        [string]$Endpoint,
        [string]$Method,
        [string]$Body
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    Invoke-RestMethod -Uri "http://localhost:5173/api/v2/auth/$Endpoint" -Method $Method -Headers $headers -Body $Body
}

# Teste de login de atleta
Write-Host "`nTestando login de Atleta:"
try {
    $response = Invoke-ApiRequest -Endpoint "athlete" -Method "POST" -Body '{"cpf": "12345678901", "password": "123456"}'
    Write-Host "Sucesso! Status: $($response.status)"
    Write-Host "Dados do atleta: $($response.data.athlete.name)"
} catch {
    Write-Host "Erro: $($_.ErrorDetails.Message)"
}

# Teste de login de professor
Write-Host "`nTestando login de Professor:"
try {
    $response = Invoke-ApiRequest -Endpoint "teacher" -Method "POST" -Body '{"email": "professor@example.com", "password": "123456"}'
    Write-Host "Sucesso! Status: $($response.status)"
    Write-Host "Dados do professor: $($response.data.teacher.name)"
} catch {
    Write-Host "Erro: $($_.ErrorDetails.Message)"
}

# Teste de login de gestor
Write-Host "`nTestando login de Gestor:"
try {
    $response = Invoke-ApiRequest -Endpoint "manager" -Method "POST" -Body '{"email": "gestor@example.com", "password": "123456"}'
    Write-Host "Sucesso! Status: $($response.status)"
    Write-Host "Dados do gestor: $($response.data.manager.name)"
} catch {
    Write-Host "Erro: $($_.ErrorDetails.Message)"
}

# Teste de login com credenciais inválidas
Write-Host "`nTestando login com credenciais inválidas (Atleta):"
try {
    $response = Invoke-ApiRequest -Endpoint "athlete" -Method "POST" -Body '{"cpf": "12345678901", "password": "senhaerrada"}'
    Write-Host "Erro esperado: $($response.message)"
} catch {
    Write-Host "Erro: $($_.ErrorDetails.Message)"
}

Write-Host "`nTestando login com campos obrigatórios faltando (Professor):"
try {
    $response = Invoke-ApiRequest -Endpoint "teacher" -Method "POST" -Body '{"email": "", "password": "123456"}'
    Write-Host "Erro esperado: $($response.message)"
} catch {
    Write-Host "Erro: $($_.ErrorDetails.Message)"
}
