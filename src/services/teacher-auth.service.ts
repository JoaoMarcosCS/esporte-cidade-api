import { Teacher } from "../entities/teacher.entity";
import bcrypt from "bcrypt";
import { AppDataSource } from "../database/config";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class TeacherAuthService {
    private teacherRepository = AppDataSource.getRepository(Teacher);

    async authenticate(email: string, password: string) {
        try {
            console.log("Tentando autenticar professor com email:", email);
            
            const teacher = await this.teacherRepository.findOne({
                where: { email },
                relations: ["modality"],
                select: {
                    id: true,
                    name: true,
                    email: true,
                    cpf: true,
                    rg: true,
                    birthday: true,
                    phone: true,
                    photo_url: true,
                    about: true,
                    modality: {
                        id: true,
                        name: true,
                        description: true
                    },
                    role: true,
                    password: true
                }
            });

            if (!teacher) {
                console.log("Professor não encontrado no banco de dados com email:", email);
                return {
                    success: false,
                    message: "Email não encontrado"
                };
            }

            console.log("Professor encontrado no banco de dados:", {
                id: teacher.id,
                email: teacher.email,
                role: teacher.role
            });

            const passwordMatch = await bcrypt.compare(password, teacher.password);
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
                    id: teacher.id,
                    name: teacher.name,
                    role: Number(teacher.role)
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
                    teacher: {
                        id: teacher.id,
                        name: teacher.name,
                        email: teacher.email,
                        cpf: teacher.cpf,
                        rg: teacher.rg,
                        birthday: teacher.birthday,
                        phone: teacher.phone,
                        photo_url: teacher.photo_url,
                        about: teacher.about,
                        modality: teacher.modality ? {
                            id: teacher.modality.id,
                            name: teacher.modality.name,
                            description: teacher.modality.description
                        } : null,
                        role: Number(teacher.role)
                    }
                }
            };

        } catch (error) {
            console.error("Erro ao autenticar professor:", error);
            return {
                success: false,
                message: "Erro ao processar autenticação"
            };
        }
    }
}
