import { Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { Atendiment } from "../entities/atendiment.entity";
import { Modality } from "../entities/modality.entity";
import { Athlete } from "../entities/athlete.entity";
import { Teacher } from "../entities/teacher.entity";

const atendimentRepository = AppDataSource.getRepository(Atendiment);
const modalityRepository = AppDataSource.getRepository(Modality);
const athleteRepository = AppDataSource.getRepository(Athlete);
const teacherRepository = AppDataSource.getRepository(Teacher);

export class AtendimentController {
  // Registrar chamada (presença/ausência) de atletas para uma modalidade
  static async registerAttendance(req: Request, res: Response) {
    try {
      const { modalityId, teacherId, attendances } = req.body;
      // attendances: [{ athleteId: number, present: boolean }]

      const modality = await modalityRepository.findOneBy({ id: modalityId });
      const teacher = await teacherRepository.findOneBy({ id: teacherId });

      if (!modality || !teacher) {
        return res.status(404).json({ message: "Modalidade ou professor não encontrado." });
      }

      const atendimentsToSave: Atendiment[] = [];
      for (const att of attendances) {
        const athlete = await athleteRepository.findOneBy({ id: att.athleteId });
        if (!athlete) continue;
        const atendiment = atendimentRepository.create({
          modality,
          athlete,
          present: att.present,
        });
        atendimentsToSave.push(atendiment);
      }

      await atendimentRepository.save(atendimentsToSave);
      return res.status(201).json({ message: "Chamada registrada com sucesso." });
    } catch (error) {
      console.error("Erro ao registrar chamada:", error);
      return res.status(500).json({ message: "Erro ao registrar chamada." });
    }
  }

  // Buscar chamadas por modalidade e data
  static async getAttendanceByModality(req: Request, res: Response) {
    try {
      const { modalityId, date } = req.query;
      const where: any = {};
      if (modalityId) where.modality = { id: Number(modalityId) };
      if (date) where.created_at = date;

      const atendiments = await atendimentRepository.find({
        where,
        relations: ["athlete", "modality"],
        order: { created_at: "DESC" },
      });

      return res.status(200).json(atendiments);
    } catch (error) {
      console.error("Erro ao buscar chamadas:", error);
      return res.status(500).json({ message: "Erro ao buscar chamadas." });
    }
  }

  // Buscar chamadas de um professor (todas modalidades que ele ministra)
  static async getAttendanceByTeacher(req: Request, res: Response) {
    try {
      const { teacherId } = req.params;
      const teacher = await teacherRepository.findOne({
        where: { id: Number(teacherId) },
        relations: ["modality"],
      });
      if (!teacher) {
        return res.status(404).json({ message: "Professor não encontrado." });
      }

      const atendiments = await atendimentRepository.find({
        where: { modality: { id: teacher.modality.id } },
        relations: ["athlete", "modality"],
        order: { created_at: "DESC" },
      });

      return res.status(200).json(atendiments);
    } catch (error) {
      console.error("Erro ao buscar chamadas do professor:", error);
      return res.status(500).json({ message: "Erro ao buscar chamadas do professor." });
    }
  }
}
