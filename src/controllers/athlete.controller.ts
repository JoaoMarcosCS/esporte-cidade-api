import { Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { Athlete } from "../entities/athlete.entity";
import bcrypt from "bcrypt";

const athleteRepository = AppDataSource.getRepository(Athlete);

export class AthleteController {
  static async getAll(req: Request, res: Response) {
    try {
      const athletes = await athleteRepository.find();
      res.status(200).json(athletes);
    } catch (error) {
      console.error("Erro ao buscar atletas:", error);
      res.status(500).json({ message: "Erro ao buscar atletas." });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido." });
      }

      const athlete = await athleteRepository.findOneBy({ id });
      if (!athlete) {
        return res.status(404).json({ message: "Atleta não encontrado." });
      }

      res.status(200).json(athlete);
    } catch (error) {
      console.error("Erro ao buscar atleta:", error);
      res.status(500).json({ message: "Erro ao buscar atleta." });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const athlete = athleteRepository.create({
        ...req.body,
        password: hashedPassword,
      });

      await athleteRepository.save(athlete);
      res.status(201).json(athlete);
    } catch (error) {
      console.error("Erro ao criar atleta:", error);
      res.status(500).json({ message: "Erro ao criar atleta." });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido." });
      }

      const athlete = await athleteRepository.findOneBy({ id });
      if (!athlete) {
        return res.status(404).json({ message: "Atleta não encontrado." });
      }

      
      Object.assign(athlete, req.body);

      
      if (req.body.password) {
        athlete.password = await bcrypt.hash(req.body.password, 10);
      }

      await athleteRepository.save(athlete);
      res.status(200).json(athlete);
    } catch (error) {
      console.error("Erro ao atualizar atleta:", error);
      res.status(500).json({ message: "Erro ao atualizar atleta." });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido." });
      }

      const athlete = await athleteRepository.findOneBy({ id });
      if (!athlete) {
        return res.status(404).json({ message: "Atleta não encontrado." });
      }

      await athleteRepository.remove(athlete);
      res.status(200).json({ message: "Atleta deletado com sucesso." });
    } catch (error) {
      console.error("Erro ao deletar atleta:", error);
      res.status(500).json({ message: "Erro ao deletar atleta." });
    }
  }
}
