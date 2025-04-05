import { AppDataSource } from "../database/config";
import { Athlete } from "../entities/athlete.entity";
import { initializeDatabase } from "../database/config";
import dotenv from "dotenv";
import request from "supertest";
import app from "../app";
import { strict as assert } from "node:assert";
import bcrypt from 'bcrypt';

dotenv.config();

const BASE_URL = "/api/v1/auth/athlete";
const TEST_CPF = "12345678901";
const TEST_PASSWORD = "123456";
const TEST_EMAIL = "test+" + Date.now() + "@test.com"; // Email único baseado no timestamp

async function setupTest() {
    try {
        // Delete existing test database file
        const fs = require('fs');
        const path = require('path');
        const dbPath = path.join(__dirname, '..', 'db.test.sqlite');
        
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }

        // Initialize database and run migrations
        await initializeDatabase();

        // Create test athlete
        const athleteRepository = AppDataSource.getRepository(Athlete);

        // Create athlete directly since Athlete extends UserBase
        const athlete = athleteRepository.create({
            cpf: TEST_CPF,
            name: "Test Athlete",
            password: await bcrypt.hash(TEST_PASSWORD, 10),
            rg: "123456789",
            birthday: "1990-01-01",
            phone: "11999999999",
            email: TEST_EMAIL,
            role: 1,
            addresses: [] // Inicializar com array vazio para as relações
        });
        await athleteRepository.save(athlete);
    } catch (error) {
        console.error('Error in setupTest:', error);
        throw error;
    }
}

async function cleanupTest() {
    try {
        // Clean up database
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    } catch (error) {
        console.error('Error in cleanupTest:', error);
        throw error;
    }
}

async function runTests() {
    try {
        await setupTest();

        // Athlete Authentication Tests
        await request(app)
            .post(`${BASE_URL}`)
            .send({
                cpf: TEST_CPF,
                password: TEST_PASSWORD
            })
            .expect(200)
            .then(response => {
                assert.strictEqual(response.body.success, true);
                assert.ok(response.body.data);
                assert.ok(response.body.data.accessToken);
                assert.ok(response.body.data.athlete);
                assert.ok(response.body.data.athlete.id);
                assert.ok(response.body.data.athlete.cpf);
                assert.strictEqual(response.body.data.athlete.role, 1);
            });

        await request(app)
            .post(`${BASE_URL}`)
            .send({
                cpf: "12345678902",
                password: TEST_PASSWORD
            })
            .expect(401)
            .then(response => {
                assert.strictEqual(response.body.success, false);
                assert.strictEqual(response.body.message, "CPF não encontrado");
            });

        await request(app)
            .post(`${BASE_URL}`)
            .send({
                cpf: TEST_CPF,
                password: "senhaerrada"
            })
            .expect(401)
            .then(response => {
                assert.strictEqual(response.body.success, false);
                assert.strictEqual(response.body.message, "Senha inválida");
            });

        await request(app)
            .post(`${BASE_URL}`)
            .send({
                cpf: ""
            })
            .expect(400)
            .then(response => {
                assert.strictEqual(response.body.success, false);
                assert.strictEqual(response.body.message, "CPF e senha são obrigatórios");
            });

        await cleanupTest();
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

export default runTests;
