import express, { Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { Modality } from "../entities/modality.entity";
import { Atendiment } from "../entities/atendiment.entity";
import { z } from "zod";
import { Athlete } from "../entities/athlete.entity";
import { LessThanOrEqual } from "typeorm";
import { Enrollment } from "../entities/enrollment.entity";
import { authenticate } from "../middlewares/middleware-auth";
import { assignTeacherToModality, createModality, deleteModality, updateModality, viewModalities, viewModalityById } from "../controllers/modality.controller";

const router = express.Router();
router.get("/all", viewModalities)
router.get("/single/:id", viewModalityById)
router.post("/create", createModality) 
router.put("/update/:id", updateModality)
router.delete("/delete/:id", deleteModality)
router.put("/assign-teacher/:modalityId", assignTeacherToModality);

const modalityRepository = AppDataSource.getRepository(Modality);
const atendimentsRepository = AppDataSource.getRepository(Atendiment);
const athleteRepository = AppDataSource.getRepository(Athlete);

export const AthleteAvailableResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  enrollments: z.array(
    z.object({
      athlete: z.object({
        id: z.number(),
        name: z.string(),
        cpf: z.string().length(11),
      }),
    })
  ),
});

export const AtendimentSchema = z.object({
  modalityId: z.number().positive(),
  athleteId: z.number().positive(),
  present: z.boolean(),
  created_at: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/),
});

export const CreateAtendimentsSchema = z.array(AtendimentSchema).nonempty();

router.get("/", async (req: Request, res: Response) => {
  try {
    const modalities = await modalityRepository.find({
      relations: ["teachers"],
    });
    // Ajuste: converter dias e locais de string para array antes de enviar
    const modalitiesWithArrays = modalities.map((mod) => ({
      ...mod,
      days_of_week: mod.days_of_week
        ? mod.days_of_week.split(",").map((s: string) => s.trim())
        : [],
      class_locations: mod.class_locations
        ? mod.class_locations.split(",").map((s: string) => s.trim())
        : [],
    }));
    res.status(200).json(modalitiesWithArrays);
  } catch (error) {
    console.error("Erro ao buscar modalidades:", error.message);
    res
      .status(500)
      .json({ message: "Erro ao buscar modalidades.", error: error.message });
  }
});

router.get(
  "/:id/athletes-availible",
  authenticate,
  async (req: Request, res: Response) => {
    const id_modality = parseInt(req.params.id, 10);

    console.log("modalidade: " + req.params.id);

    // Primeiro buscamos os atletas ativos
    const athletes = await athleteRepository.find({
      where: {
        enrollments: {
          active: true,
          approved: true,
          modality: {
            id: id_modality,
          },
        },
      },
      select: {
        id: true,
        name: true,
        photo_url: true,
      },
      order: {
        name: "ASC",
      },
    });

    // Agora buscamos as faltas para cada atleta
    const athletesWithAbsences = await Promise.all(
      athletes.map(async (athlete) => {
        const absencesCount = await atendimentsRepository.count({
          where: {
            athlete: { id: athlete.id },
            modality: { id: id_modality },
            present: false,
          },
        });

        return {
          ...athlete,
          faltas: absencesCount,
        };
      })
    );

    res.status(200).json(athletesWithAbsences);
  }
);

router.post("/:id/receive-atendiments", async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const validation = CreateAtendimentsSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: validation.error.errors,
      });
    }

    const atendiments = validation.data;

    if (!Array.isArray(atendiments) || atendiments.length === 0) {
      res.status(400).json({ message: "Dados de atendimento inválidos." });
    }

    const modalityId = parseInt(req.params.id, 10);
    // Verifica se todos os atendimentos são para a modalidade da URL
    const invalidModality = atendiments.some(
      (a) => a.modalityId !== modalityId
    );
    if (invalidModality) {
      return res.status(400).json({
        message: "Alguns atendimentos são para modalidades diferentes",
      });
    }

    await atendimentsRepository
      .createQueryBuilder()
      .insert()
      .into(Atendiment)
      .values(
        atendiments.map((a) => ({
          modality: { id: a.modalityId },
          athlete: { id: a.athleteId },
          present: a.present,
          created_at: new Date(
            (a.created_at ? new Date(a.created_at) : new Date()).getTime() -
              3 * 60 * 60 * 1000
          ),
        }))
      )
      .execute();

    const atendimentosComFalta = atendiments.filter((a) => !a.present);

    for (const atendimento of atendimentosComFalta) {
      const totalFaltas = await atendimentsRepository.count({
        where: {
          athlete: { id: atendimento.athleteId },
          modality: { id: modalityId },
          present: false,
          created_at: LessThanOrEqual(
            new Date(atendimento.created_at) || new Date()
          ),
        },
      });

      const enrollmentRepository = AppDataSource.getRepository(Enrollment);
      // Inativa após 3 faltas
      if (totalFaltas > 2) {
        await enrollmentRepository.update(
          {
            athlete: { id: atendimento.athleteId },
            modality: { id: modalityId },
          },
          { active: false }
        );

        const athlete = await athleteRepository.findOneBy({
          id: atendimento.athleteId,
        });
        console.log(
          `Atleta ${athlete?.name} INATIVADO por ${totalFaltas} faltas`
        );
      }
    }

    console.log("recebeu");

    res.status(201).json({ message: "Atendimentos registrados com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar atendimentos:", error.message);
    res.status(500).json({
      message: "Erro ao registrar atendimentos.",
      error: error.message,
    });
  }
});

export default router;
