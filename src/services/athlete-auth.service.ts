import { Athlete } from "../entities/athlete.entity";
import { AppDataSource } from "../database/config";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const athleteRepository = AppDataSource.getRepository(Athlete);

export const authenticateUser = async (cpf: string, password: string) => {
    try {
        const athlete = await athleteRepository.findOne({
            where: {
                cpf
            },
            select: {
                id: true,
                cpf: true,
                role: true,
                password: true
            }
        });

        if (!athlete) {
            return {
                success: false,
                message: "CPF não encontrado"
            };
        }

        const passwordMatch = await bcrypt.compare(password, athlete.password);

        if (!passwordMatch) {
            return {
                success: false,
                message: "Senha inválida"
            };
        }

        const token = sign(
            {
                id: athlete.id,
                name: athlete.name,
                role: Number(athlete.role)
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30m"
            }
        );

        return {
            success: true,
            data: {
                accessToken: token,
                athlete: {
                    id: athlete.id,
                    cpf: athlete.cpf,
                    role: Number(athlete.role)
                }
            }
        };

    } catch (error) {
        return {
            success: false,
            message: "Erro ao processar autenticação"
        };
    }
}
