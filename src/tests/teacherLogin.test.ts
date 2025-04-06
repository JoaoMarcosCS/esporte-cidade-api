import { Teacher } from "../entities/teacher.entity";
import { AppDataSource } from "../database/config";
import { initializeDatabase, runMigrations } from "../database/config";
import { Roles } from "../enums/roles.enum";
import request from "supertest";
import app from "../app";
import bcrypt from "bcrypt";
import { strict as assert } from "node:assert";
import { describe, it, beforeEach, afterEach } from "node:test";

const BASE_URL = "/api/auth";

beforeEach(async () => {
    try {
        // Delete existing test database file
        const fs = require('fs');
        const path = require('path');
        const dbPath = path.join(__dirname, '..', '..', 'db.test.sqlite');
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }

        // Initialize database and run migrations
        await initializeDatabase();
        await runMigrations();

        // Clear existing data
        const teacherRepository = AppDataSource.getRepository(Teacher);
        await teacherRepository.clear();

        // Create test data
        const teachers = [
            {
                name: "Professor Alice",
                password: "securepassword456",
                cpf: "12345678901",
                rg: "12345678",
                birthday: "1980-03-10",
                phone: "+5511987654321",
                photo_url: "https://example.com/photos/teacheralice.jpg",
                email: `teacheralice-${Date.now()}@example.com`,
                about: "Instrutora experiente de yoga.",
                role: Roles.TEACHER
            }
        ];

        // Hash passwords and save
        for (const teacher of teachers) {
            teacher.password = await bcrypt.hash(teacher.password, 10);
        }

        await teacherRepository.save(teachers);
    } catch (error) {
        console.error('Error in beforeEach:', error);
        throw error;
    }
});

afterEach(async () => {
    try {
        // Clean up database
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    } catch (error) {
        console.error('Error in afterEach:', error);
        throw error;
    }
});

describe("Testing the Teacher Authentication", () => {
    describe("POST /teacher", () => {
        it("deve retornar 200 e dados do professor com email e senha válidos", async () => {
            try {
                const response = await request(app)
                    .post(`${BASE_URL}/teacher`)
                    .send({
                        email: `teacheralice-${Date.now()}@example.com`,
                        password: "securepassword456"
                    });

                assert.strictEqual(response.status, 200, "Status deveria ser 200");
                assert.ok(response.body.id, "Resposta deveria conter ID");
                assert.ok(response.body.name, "Resposta deveria conter nome");
                assert.strictEqual(response.body.name, "Professor Alice", "Nome não corresponde");
            } catch (error) {
                console.error('Error in test:', error);
                throw error;
            }
        });

        it("deve retornar 401 com email ou senha inválidos", async () => {
            try {
                const response = await request(app)
                    .post(`${BASE_URL}/teacher`)
                    .send({
                        email: `teacheralice-${Date.now()}@example.com`,
                        password: "senhaerrada"
                    });

                assert.strictEqual(response.status, 401, "Status deveria ser 401");
                assert.ok(response.body.message, "Resposta deveria conter mensagem");
                assert.strictEqual(response.body.message, "Teacher not authenticated", "Mensagem de erro incorreta");
            } catch (error) {
                console.error('Error in test:', error);
                throw error;
            }
        });
    });
});
