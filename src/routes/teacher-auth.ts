import express, { Request, Response } from "express";
import { TeacherController } from "../controllers/teacher.controller";

const router = express.Router();
const teacherController = new TeacherController();

interface LoginResponse {
    success: boolean;
    message?: string;
    data?: any;
}

router.post("/login", (req: Request, res: Response) => {
    (async () => {
        try {
            const { email, password } = req.body;
            
            const result = await teacherController.login(req, res) as LoginResponse;

            if (!result.success) {
                return res.status(401).json(result);
            }

            return res.status(200).json(result);
        } catch (error: any) {
            console.error("Erro no login do professor:", error);
            return res.status(500).json({
                success: false,
                message: "Erro ao processar autenticação"
            });
        }
    })();
});

export default router;
