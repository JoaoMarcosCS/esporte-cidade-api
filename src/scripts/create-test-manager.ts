import { AppDataSource } from "../database/config";
import { Manager } from "../entities/manager.entity";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function createTestManager() {
    try {
        await AppDataSource.initialize();
        console.log("Database initialized successfully");

        const managerRepository = AppDataSource.getRepository(Manager);

        // Verificar se o gerente já existe
        const existingManager = await managerRepository.findOne({
            where: {
                email: "test@gerente.com"
            },
            select: {
                id: true,
                email: true
            }
        });

        if (existingManager) {
            console.log("Gerente já existe no banco de dados:", existingManager);
            return;
        }

        // Criar novo gerente
        const manager = managerRepository.create({
            email: "test@gerente.com",
            name: "Test Gerente",
            password: await bcrypt.hash("123456", 10),
            cpf: "12345678901",
            rg: "123456789",
            birthday: "1980-01-01",
            phone: "11999999999",
            photo_url: "",
            role: 1 // 1 é o valor para gerente no enum Roles
        });

        await managerRepository.save(manager);
        console.log("Gerente de teste criado com sucesso!", manager);

        // Fechar conexão com o banco de dados
        await AppDataSource.destroy();
    } catch (error) {
        console.error("Erro ao criar gerente de teste:", error);
        process.exit(1);
    }
}

createTestManager();
