import { Request, Response } from "express";
import { AthleteAuthService } from "../services/auth-athlete.service";
import { ManagerAuthService } from "../services/auth-manager.service";
import { TeacherAuthService } from "../services/auth-teacher.service";
import {Log} from "../utils/personalizedLogs.util"
export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { type, credentials } = req.body;

      console.log(type);
      console.log(credentials);

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

          return;
      }

      if (!result.success) {
        res.status(401).json(result);
        return;
      }
      //definir tempo do refresh token
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
      return;
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });

      return;
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken");
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
      }
      res.status(204).end();
      return;
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });

      return;
    }
  }

  static async confirmPassword(req: Request, res: Response): Promise<void> {
  try {
    const { password } = req.body;
    const { id, type } = req.user!;

    Log.info(`Recebida requisição de confirmação de senha do tipo ${type}, ID ${id}`);

    let result;
    switch (type) {
      case "athlete":
        result = await new AthleteAuthService().confirmPassword(password, id, type);
        break;
      case "manager":
        result = await new ManagerAuthService().confirmPassword(password, id, type);
        break;
      case "teacher":
        result = await new TeacherAuthService().confirmPassword(password, id, type);
        break;
      default:
        Log.error(`Tipo de usuário inválido: ${type}`);
        res.status(400).json({
          success: false,
          message: "Tipo de usuário inválido",
        });
        return;
    }

    if (!result.success) {
      Log.error(`Falha na confirmação da senha para ID ${id}: ${result.message}`);
      res.status(401).json(result);
      return;
    }

    Log.success(`Senha confirmada com sucesso para ID ${id}`);
    res.status(200).json({ success: true, result });
  } catch (error) {
    Log.error(`Erro inesperado na confirmação de senha: ${error}`);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
}
}