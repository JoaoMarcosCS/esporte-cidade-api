import { Manager } from "../entities/manager.entity";
import bcrypt from "bcrypt";
import { AppDataSource } from "../database/config";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class ManagerAuthService {
    private managerRepository = AppDataSource.getRepository(Manager);

    async authenticate(email: string, password: string) {
        try {
            console.log("Tentando autenticar gerente com email:", email);
            
            const manager = await this.managerRepository.findOne({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    cpf: true,
                    rg: true,
                    birthday: true,
                    phone: true,
                    photo_url: true,
                    role: true,
                    password: true
                }
            });

            if (!manager) {
                console.log("Gerente não encontrado no banco de dados com email:", email);
                return {
                    success: false,
                    message: "Email não encontrado"
                };
            }

            console.log("Gerente encontrado no banco de dados:", {
                id: manager.id,
                email: manager.email,
                role: manager.role
            });

            const passwordMatch = await bcrypt.compare(password, manager.password);
            console.log("Verificação de senha:", passwordMatch);

            if (!passwordMatch) {
                console.log("Senha não confere com o hash no banco para o email:", email);
                return {
                    success: false,
                    message: "Senha inválida"
                };
            }

            const token = sign(
                {
                    id: manager.id,
                    name: manager.name,
                    role: Number(manager.role)
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
                    manager: {
                        id: manager.id,
                        name: manager.name,
                        email: manager.email,
                        cpf: manager.cpf,
                        rg: manager.rg,
                        birthday: manager.birthday,
                        phone: manager.phone,
                        photo_url: manager.photo_url,
                        role: Number(manager.role)
                    }
                }
            };

        } catch (error) {
            console.error("Erro ao autenticar gerente:", error);
            return {
                success: false,
                message: "Erro ao processar autenticação"
            };
        }
    }
}
