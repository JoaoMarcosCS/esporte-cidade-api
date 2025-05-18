import express, { Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { Atendiment } from "../entities/atendiment.entity";
import { authenticate } from "../middlewares/middleware-auth"; // Add authentication middleware

const router = express.Router();

// Add authentication middleware
router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    // Get athlete name from query params instead of token
    const athleteName = req.query.athlete;
    
    if (!athleteName || typeof athleteName !== "string") {
      return res.status(400).json({ message: "Athlete name parameter required" });
    }

    const decodedName = decodeURIComponent(athleteName);
    console.log("Fetching absences for:", decodedName);

    const modalityFilter = req.query.modality 
      ? parseInt(req.query.modality as string) 
      : null;

    const query = AppDataSource.getRepository(Atendiment)
      .createQueryBuilder("atendiment")
      .leftJoinAndSelect("atendiment.athlete", "athlete")
      .leftJoinAndSelect("atendiment.modality", "modality")
      .where("athlete.name = :name", { name: decodedName });

    if (modalityFilter && !isNaN(modalityFilter)) {
      query.andWhere("modality.id = :modalityId", { 
        modalityId: modalityFilter 
      });
    }

    // seleciona todas as modalidades
    const athleteModalities = await AppDataSource.getRepository(Atendiment)
    .createQueryBuilder("atendiment")
    .leftJoinAndSelect("atendiment.modality", "modality")
    .leftJoin("atendiment.athlete", "athlete")
    .where("athlete.name = :name", { name: decodedName })
    .select("DISTINCT modality.id, modality.name")
    .getRawMany();

    const atendimentos = await query.getMany();

    console.log("Atendimentos encontrados:", atendimentos);

    // Diagnóstico: Se atendimentos está vazio, pode ser por:
    // 1. Não existem registros de Atendiment para esse atleta no banco.
    // 2. O nome do atleta não bate exatamente (acentuação, espaços, maiúsculas/minúsculas).
    // 3. Os registros de Atendiment não estão sendo criados corretamente no momento da chamada.

    // DICA DE DEBUG:
    // 1. Verifique no banco se há registros na tabela 'atendiment' para esse atleta.
    // 2. Teste a query diretamente no banco, usando o nome exatamente como está salvo.
    // 3. Se necessário, troque o filtro para usar o id do atleta ao invés do nome (mais seguro).

    //formatar a data
    const formattedData = atendimentos.map(atendimento => {
      return {
        data: atendimento.created_at,
        modalidade: atendimento.modality?.name || "N/A",
        //local: atendimento.modality?.class_locations?.[0] || "N/A",
        present: atendimento.present
      };
    });

    // Debug: veja o que está sendo filtrado como falta
    const absences = formattedData.filter(item => !item.present);
    console.log("Absences filtradas:", absences);

    res.status(200).json({
      absences,
      modalities: athleteModalities,
      totalAbsences: absences.length
    });
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;