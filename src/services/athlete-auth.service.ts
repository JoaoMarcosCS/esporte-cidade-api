import { Athlete } from "../entities/athlete.entity";
import { AppDataSource } from "../database/config";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import env from "@/environment/env";

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
                console.log("Atleta não encontrado no banco de dados");
                return {
                    success: false,
                    message: "CPF não encontrado"
                };
            }

            console.log("Atleta encontrado no banco de dados:", {
                id: athlete.id,
                cpf: athlete.cpf,
                name: athlete.name,
                role: athlete.role
            });

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
                    cpf: athlete.cpf,
                    role: Number(athlete.role)
                },
                env.JWT_SECRET,
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
                        name: athlete.name,
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
