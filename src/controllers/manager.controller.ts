import { Request, Response } from "express";
import { ManagerAuthService } from "../services/manager-auth.service";
import { Manager } from "../entities/manager.entity";
import { AppDataSource } from "../database/config";
import { ManagerRepository } from "../repositories/manager.repository";
import dotenv from "dotenv";

dotenv.config();

export class ManagerController {
    private managerRepository: ManagerRepository;
    private managerAuthService: ManagerAuthService;

    constructor() {
        this.managerRepository = AppDataSource.getCustomRepository(ManagerRepository);
        this.managerAuthService = new ManagerAuthService();
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email e senha são obrigatórios"
                });
            }

            const result = await this.managerAuthService.authenticate(email, password);

            if (!result.success) {
                return res.status(401).json(result);
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error("Erro no login do gerente:", error);
            return res.status(500).json({
                success: false,
                message: "Erro ao processar autenticação"
            });
        }
    }

    async profile(req: Request, res: Response) {
        try {
            const manager = req.manager as Manager;
            
            if (!manager) {
                return res.status(401).json({
                    success: false,
                    message: "Não autorizado"
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    id: manager.id,
                    name: manager.name,
                    email: manager.email,
                    cpf: manager.cpf,
                    rg: manager.rg,
                    birthday: manager.birthday,
                    phone: manager.phone,
                    photo_url: manager.photo_url,
                    role: manager.role
                }
            });
        } catch (error) {
            console.error("Erro ao buscar perfil do gerente:", error);
            return res.status(500).json({
                success: false,
                message: "Erro ao processar perfil"
            });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const manager = req.manager as Manager;
            const { name, email, phone, photo_url } = req.body;

            if (!manager) {
                return res.status(401).json({
                    success: false,
                    message: "Não autorizado"
                });
            }

            const updatedManager = await this.managerRepository.updateProfile(
                manager.id,
                { name, email, phone, photo_url }
            );

            return res.status(200).json({
                success: true,
                data: updatedManager
            });
        } catch (error) {
            console.error("Erro ao atualizar perfil do gerente:", error);
            return res.status(500).json({
                success: false,
                message: "Erro ao atualizar perfil"
            });
        }
    }
}
