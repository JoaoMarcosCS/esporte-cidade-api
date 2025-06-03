import express from "express"; 
import { AppDataSource } from "../database/config";
import { Athlete } from "../entities/athlete.entity";
import { Enrollment } from "../entities/enrollment.entity";
import { Modality } from "../entities/modality.entity";
import { Teacher } from "../entities/teacher.entity";
import { authentication } from "../middleware/auth.middleware";
import { timeToMinute } from "../utils/convertTime";
import { Log } from "../utils/personalizedLogs.util"; // <-- Importando o logger

const router = express.Router();

const teacherRepository = AppDataSource.getRepository(Teacher);
const athleteRepository = AppDataSource.getRepository(Athlete);
const enrollmentRepository = AppDataSource.getRepository(Enrollment);

router.get("/athlete", authentication, async (req, res) => {
  try {
    const { id } = req.user;
    Log.info(`Requisição recebida para /athlete com id: ${id}`);

    const enrollment = await enrollmentRepository.find({
      where: { athlete: { id }, active: true },
      relations: ["modality"],
    });

    if (!enrollment.length) {
      Log.error("Nenhuma matrícula ativa encontrada.");
      return res.status(404).json({ error: "Matrícula não encontrada." });
    }

    const classes = enrollment.map((enrollment) => {
      const modality = enrollment.modality;
      return {
        name: modality.name,
        days_of_week: modality.days_of_week,
        start_time: modality.start_time,
        end_time: modality.end_time,
        start_time_minutes: timeToMinute(modality.start_time),
        end_time_minutes: timeToMinute(modality.end_time),
        class_locations: modality.class_locations
          ?.split(",")
          .map((loc) => loc.trim()) || [],
      };
    });

    Log.success(`Matrículas encontradas: ${classes.length}`);
    return res.status(200).json(classes);
  } catch (error: any) {
    Log.error(`Erro no /athlete: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.get("/teacher", authentication, async (req, res) => {
  try {
    const { id } = req.user;
    Log.info(`Requisição recebida para /teacher com id: ${id}`);

    const teacher = await teacherRepository.findOne({
      where: { id },
      relations: ["modality"],
    });

    Log.debug(`Resultado do findOne: ${JSON.stringify(teacher, null, 2)}`);

    if (!teacher || !teacher.modality) {
      Log.error("Professor não encontrado ou sem modalidade.");
      return res.status(404).json({ error: "Não vinculado a uma modalidade" });
    }

    const classes = teacher.modality;

    Log.debug(`Modality encontrada: ${JSON.stringify(classes, null, 2)}`);

    const response = {
      name: classes.name,
      days: classes.days_of_week,
      start_time: classes.start_time,
      end_time: classes.end_time,
      start_time_minutes: timeToMinute(classes.start_time),
      end_time_minutes: timeToMinute(classes.end_time),
      class_locations: classes.class_locations
        .split(",")
        .map((loc) => loc.trim()),
    };

    Log.success("Horário do professor encontrado com sucesso.");
    Log.debug(`Resposta final: ${JSON.stringify(response, null, 2)}`);
    
    return res.status(200).json(response);
  } catch (error: any) {
    Log.error(`Erro no /teacher: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;