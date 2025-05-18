import express, { Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { Modality } from "../entities/modality.entity";
import { Atendiment } from "../entities/atendiment.entity";

const router = express.Router();
const modalityRepository = AppDataSource.getRepository(Modality);
const atendimentsRepository = AppDataSource.getRepository(Atendiment);

router.get("/", async (req: Request, res: Response) => {
  try {
    const modalities = await modalityRepository.find({
      relations: ["teachers"],
    });
    // Ajuste: converter dias e locais de string para array antes de enviar
    const modalitiesWithArrays = modalities.map((mod) => ({
      ...mod,
      days_of_week: mod.days_of_week ? mod.days_of_week.split(',').map((s: string) => s.trim()) : [],
      class_locations: mod.class_locations ? mod.class_locations.split(',').map((s: string) => s.trim()) : [],
    }));
    res.status(200).json(modalitiesWithArrays);
  } catch (error) {
    console.error("Erro ao buscar modalidades:", error.message);
    res
      .status(500)
      .json({ message: "Erro ao buscar modalidades.", error: error.message });
  }
});

router.get("/:id/athletes-availible", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  const modalities = await modalityRepository.find({
    where: {
      id,
      enrollments: {
        active: true,
        approved: true,
      },
    },
    order: {
      enrollments: {
        athlete: {
          name: "ASC",
        }
      },
    },
    relations: ["enrollments", "enrollments.athlete"],
  });

  // Extrair apenas os atletas das inscrições
  let athletes_availible: any[] = [];
  if (modalities.length > 0) {
    athletes_availible = modalities[0].enrollments
      .filter((enrollment: any) => enrollment.active && enrollment.approved)
      .map((enrollment: any) => ({
        id: enrollment.athlete.id,
        name: enrollment.athlete.name,
        cpf: enrollment.athlete.cpf,
      }));
  }

  res.status(200).json({ athletes_availible });
});

router.post("/:id/receive-atendiments", async (req: Request, res: Response) => {
  try {
    const atendiments = req.body;
    console.log("Recebido para registro de chamada:", atendiments);

    if (!Array.isArray(atendiments) || atendiments.length === 0) {
      return res.status(400).json({ message: "Esperado um array de atendimentos, mas recebeu:", recebido: atendiments });
    }

    // Validação básica dos campos esperados
    for (const item of atendiments) {
      if (
        typeof item.modalityId !== "number" ||
        typeof item.athleteId !== "number" ||
        typeof item.present !== "boolean"
      ) {
        return res.status(400).json({ message: "Formato de atendimento inválido.", item });
      }
    }

    // Grave também o horário (campo 'hora_chamada')
    const atendimentosParaSalvar = atendiments.map((item: any) => ({
      modality: { id: item.modalityId },
      athlete: { id: item.athleteId },
      present: item.present,
      created_at: item.created_at || new Date(),
      hora_chamada: item.hora_chamada || new Date().toTimeString().slice(0, 8), // formato HH:MM:SS
    }));

    await atendimentsRepository.save(atendimentosParaSalvar);

    res.status(201).json({ message: "Atendimentos registrados com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar atendimentos:", error.message, error);
    res.status(500).json({
      message: "Erro ao registrar atendimentos.",
      error: error.message,
    });
  }
});

export default router;
