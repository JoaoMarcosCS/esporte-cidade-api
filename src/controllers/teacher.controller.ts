import { Request, Response } from "express";
import { TeacherAuthService } from "../services/teacher-auth.service";

export class TeacherController {
    private teacherAuthService = new TeacherAuthService();

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            
            return await this.teacherAuthService.authenticate(email, password);
        } catch (error: any) {
            console.error("Erro no login do professor:", error);
            return {
                success: false,
                message: "Erro ao processar autenticação"
            };
        }
    }
}
