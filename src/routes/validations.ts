import express from "express";
import { cpfValidator } from "../utils/cpf-validator.util";
import { Athlete } from "../entities/athlete.entity";
import { AppDataSource } from "../database/config";

const router = express.Router();
const athleteRepository = AppDataSource.getRepository(Athlete);

router.post("/cpf", async (req, res) => {
  try {
    const { cpf } = req.body;

    if (!cpf) {
      return res.status(400).json({
        valid: false,
        message: "CPF não fornecido",
      });
    }

    const cleanedCpf = cpf.replace(/[^\d]+/g, "");

    if (!cpfValidator.isValidCpf(cleanedCpf)) {
      return res.status(400).json({
        valid: false,
        message: "CPF inválido",
      });
    }

    const existingAthlete = await athleteRepository.findOneBy({
      cpf: cleanedCpf,
    });
    if (existingAthlete) {
      return res.status(400).json({
        valid: false,
        message: "Este CPF já está cadastrado",
      });
    }

    return res.status(200).json({
      valid: true,
      message: "CPF válido",
    });
  } catch (error) {
    console.error("Erro na validação de CPF:", error);
    return res.status(500).json({
      valid: false,
      message: "Erro interno no servidor",
    });
  }
});

router.post("/email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        valid: false,
        message: "Email não fornecido",
      });
    }

    const existingEmail = await athleteRepository.findOneBy({ email });

    if (existingEmail) {
      return res.status(400).json({
        valid: false,
        message: "Email já cadastrado",
      });
    }

    return res.status(200).json({
      valid: true,
      message: "Email válido",
    });

  } catch (error) {
    console.error("Erro na validação de email: ", error);
    return res.status(500).json({
      valid: false,
      message: "Erro interno no servidor",
    });
  }
});
export default router;
