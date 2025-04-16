import { AppDataSource } from "../database/config";
import { Athlete } from "../entities/athlete.entity";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function createTestAthlete() {
    try {
        await AppDataSource.initialize();
        console.log("Database initialized successfully");

        const athleteRepository = AppDataSource.getRepository(Athlete);

        // Verificar se o atleta já existe
        const existingAthlete = await athleteRepository.findOne({
            where: {
                cpf: "12345678901"
            }
        });

        if (existingAthlete) {
            console.log("Atleta já existe no banco de dados");
            return;
        }

        // Criar novo atleta
        const athlete = athleteRepository.create({
            cpf: "12345678901",
            name: "Test Athlete",
            password: await bcrypt.hash("123456", 10),
            rg: "123456789",
            birthday: "1990-01-01",
            phone: "11999999999",
            email: "test+" + Date.now() + "@test.com",
            role: 1,
            addresses: []
        });

        const savedAthlete = await athleteRepository.save(athlete);
        console.log("Atleta de teste criado com sucesso!");
        console.log("ID do atleta:", savedAthlete.id);
        console.log("CPF:", savedAthlete.cpf);
        console.log("Email:", savedAthlete.email);

        // Fechar conexão com o banco de dados
        await AppDataSource.destroy();
    } catch (error) {
        console.error("Erro ao criar atleta de teste:", error);
        process.exit(1);
    }
}

createTestAthlete();
