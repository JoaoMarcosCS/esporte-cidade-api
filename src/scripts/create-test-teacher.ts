import { AppDataSource } from "../database/config";
import { Teacher } from "../entities/teacher.entity";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function createTestTeacher() {
    try {
        await AppDataSource.initialize();
        console.log("Database initialized successfully");

        const teacherRepository = AppDataSource.getRepository(Teacher);

        // Verificar se o professor já existe
        const existingTeacher = await teacherRepository.findOne({
            where: {
                email: "test@professor.com"
            },
            relations: ["modality"],
            select: {
                id: true,
                name: true,
                email: true,
                cpf: true,
                password: true,
                role: true,
                modality: {
                    id: true
                }
            }
        });

        if (existingTeacher) {
            console.log("Professor já existe no banco de dados:", existingTeacher);
            return;
        }

        // Criar novo professor
        const teacher = teacherRepository.create({
            email: "test@professor.com",
            name: "Test Professor",
            password: await bcrypt.hash("123456", 10),
            cpf: "98765432100",
            rg: "987654321",
            birthday: "1980-01-01",
            phone: "11999999999",
            photo_url: "",
            about: "Professor de teste",
            role: 2, // 2 é o valor para professor no enum Roles
            modality: null // Como não temos uma modalidade específica, deixamos como null
        });

        await teacherRepository.save(teacher);
        console.log("Professor de teste criado com sucesso!", teacher);

        // Fechar conexão com o banco de dados
        await AppDataSource.destroy();
    } catch (error) {
        console.error("Erro ao criar professor de teste:", error);
        process.exit(1);
    }
}

createTestTeacher();
