import { Athlete } from "../entities/athlete.entity";
import { AppDataSource } from "../database/config";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export class AthleteAuthService {
    private athleteRepository = AppDataSource.getRepository(Athlete);

    async authenticate(cpf: string, password: string) {
        try {
            console.log("Tentando autenticar atleta com CPF:", cpf);
            
            const athlete = await this.athleteRepository.findOne({
                where: {
                    cpf
                },
                select: {
                    id: true,
                    cpf: true,
                    name: true,
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
            console.log("Verificação de senha:", passwordMatch);

            if (!passwordMatch) {
                console.log("Senha não confere com o hash no banco");
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
                process.env.JWT_SECRET || "osn2in0nmx--!@34noxm",
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
            console.error("Erro ao autenticar atleta:", error);
            return {
                success: false,
                message: "Erro ao processar autenticação"
            };
        }
    }
}
