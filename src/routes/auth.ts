import express, { Request, Response, NextFunction } from "express";
import { ExpressRequest } from "../types/express.d";
import { AthleteAuthService } from "../services/athlete-auth.service";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const athleteAuthService = new AthleteAuthService();

const authenticateAthlete = async (req: ExpressRequest, res: Response, next: NextFunction) => {
    try {
        const { cpf, password } = req.body;

        if (!cpf || !password) {
            res.status(400).json({
                success: false,
                message: "CPF e senha são obrigatórios"
            });
            return;
        }

        const result = await athleteAuthService.authenticate(cpf, password);

        if (!result.success) {
            res.status(401).json(result);
            return;
        }

        req.athlete = {
            id: result.data.athlete.id,
            cpf: result.data.athlete.cpf,
            role: result.data.athlete.role
        };
        req.accessToken = result.data.accessToken;
        next();
    } catch (error) {
        console.error("Erro na rota de login do atleta:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor"
        });
    }
};

router.post("/", authenticateAthlete, (req: ExpressRequest, res: Response) => {
    if (!req.athlete || !req.accessToken) {
        res.status(401).json({
            success: false,
            message: "Athlete not authenticated"
        });
        return;
    }
    
    res.status(200).json({
        success: true,
        data: {
            accessToken: req.accessToken,
            athlete: req.athlete
        }
    });
});

export default router;