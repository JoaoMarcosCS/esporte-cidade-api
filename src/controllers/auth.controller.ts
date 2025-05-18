import { Request, Response } from "express";
import { AthleteAuthService } from "../services/auth-athlete.service";
import { ManagerAuthService } from "../services/auth-manager.service";
import { TeacherAuthService } from '../services/auth-teacher.service';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Log para depuração do backend
      console.log("Corpo recebido em /auth/login:", req.body);

      const { type, credentials } = req.body;

      // Log para garantir que o campo type está correto
      console.log("Tipo recebido:", type);
      console.log("Credenciais recebidas:", credentials);

      // Verificação extra: se type for "manager" mas está vindo "teacher", o frontend não está enviando corretamente
      if (type === "teacher" && credentials.email && credentials.email.includes("gestor")) {
        console.warn("ATENÇÃO: Tentativa de login de gestor caiu no fluxo de teacher. O campo 'type' deveria ser 'manager'.");
      }

      let result;
      switch (type) {
        case "athlete":
          result = await new AthleteAuthService().authenticate(credentials);
          break;
        case "manager":
          result = await new ManagerAuthService().authenticate(credentials);
          break;
        case "teacher":
            result = await new TeacherAuthService().authenticate(credentials);
          break;
        default:
            res.status(400).json({
                success: false,
                message: "Tipo de usuário inválido",
              });

            return
      }

      if (!result.success) {
        res.status(401).json(result);
        return
      }

      // Set refresh token as HTTP-only cookie
      res.cookie("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.json({
        accessToken: result.data.accessToken,
        user: result.data.user,
      });
      return
      
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
      
      return
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // Clear refresh token cookie
      res.clearCookie("refreshToken");

      // Optionally blacklist the access token
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        // Add to blacklist if implemented
      }
      res.status(204).end();
      return

    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
      
      return 
    }
  }
}
