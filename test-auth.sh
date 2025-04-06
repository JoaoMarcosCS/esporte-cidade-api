#!/bin/bash

# Teste de autenticação do Atleta
echo "\nTestando login de Atleta:"
curl -X POST http://localhost:3000/api/auth/athlete \
  -H "Content-Type: application/json" \
  -d '{"cpf": "12345678901", "password": "123456"}'

echo "\nTestando login de Atleta com credenciais inválidas:"
curl -X POST http://localhost:3000/api/auth/athlete \
  -H "Content-Type: application/json" \
  -d '{"cpf": "12345678901", "password": "senhaerrada"}'

echo "\nTestando login de Atleta sem campos obrigatórios:"
curl -X POST http://localhost:3000/api/auth/athlete \
  -H "Content-Type: application/json" \
  -d '{"cpf": ""}'

# Teste de autenticação do Professor
echo "\nTestando login de Professor:"
curl -X POST http://localhost:3000/api/auth/teacher \
  -H "Content-Type: application/json" \
  -d '{"email": "professor@example.com", "password": "123456"}'

echo "\nTestando login de Professor com credenciais inválidas:"
curl -X POST http://localhost:3000/api/auth/teacher \
  -H "Content-Type: application/json" \
  -d '{"email": "professor@example.com", "password": "senhaerrada"}'

echo "\nTestando login de Professor sem campos obrigatórios:"
curl -X POST http://localhost:3000/api/auth/teacher \
  -H "Content-Type: application/json" \
  -d '{"email": ""}'

# Teste de autenticação do Gestor
echo "\nTestando login de Gestor:"
curl -X POST http://localhost:3000/api/auth/manager \
  -H "Content-Type: application/json" \
  -d '{"email": "gestor@example.com", "password": "123456"}'

echo "\nTestando login de Gestor com credenciais inválidas:"
curl -X POST http://localhost:3000/api/auth/manager \
  -H "Content-Type: application/json" \
  -d '{"email": "gestor@example.com", "password": "senhaerrada"}'

echo "\nTestando login de Gestor sem campos obrigatórios:"
curl -X POST http://localhost:3000/api/auth/manager \
  -H "Content-Type: application/json" \
  -d '{"email": ""}'
