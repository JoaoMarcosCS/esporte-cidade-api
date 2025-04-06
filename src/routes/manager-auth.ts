import express, { Request, Response, NextFunction } from "express";
import { ManagerAuthService } from "../services/manager-auth.service";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const managerAuthService = new ManagerAuthService();

interface ManagerAuthResponse {
    success: boolean;
    message?: string;
    data?: {
        accessToken: string;
        manager: any;
    };
}

interface ManagerRequest extends Request {
    manager?: any;
}

const authenticateManager = async (req: ManagerRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email e senha são obrigatórios"
            });
            return;
        }

        const result = await managerAuthService.authenticate(email, password) as ManagerAuthResponse;

        if (!result.success) {
            res.status(401).json(result);
            return;
        }

        req.manager = result.data.manager;
        next();
    } catch (error: any) {
        console.error("Erro na autenticação do gerente:", error);
        res.status(500).json({
            success: false,
            message: "Erro ao processar autenticação"
        });
    }
};

router.post("/login", authenticateManager, (req: ManagerRequest, res: Response) => {
    if (!req.manager) {
        res.status(401).json({
            success: false,
            message: "Não autorizado"
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: {
            accessToken: req.manager.accessToken,
            manager: req.manager
        }
    });
});

export default router;
