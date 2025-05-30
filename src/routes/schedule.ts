import express from "express";
import { AppDataSource } from "src/database/config";
import { Athlete } from "src/entities/athlete.entity";
import { Enrollment } from "src/entities/enrollment.entity";
import { Modality } from "src/entities/modality.entity";
import { Teacher } from "src/entities/teacher.entity";
import { authentication } from "../middleware/auth.middleware";
import { timeToMinute } from "../utils/convertTime";
const router = express.Router();

const teacherRepository = AppDataSource.getRepository(Teacher);
const athleteRepository = AppDataSource.getRepository(Athlete);
const enrollmentRepository = AppDataSource.getRepository(Enrollment);
const modalityRepository = AppDataSource.getRepository(Modality);

router.get("/athlete", async (req, res) => {
  try {
    const query = req.query;

    const { id } = req.user;

    const enrollment = await enrollmentRepository.find({
      where: { athlete: { id }, active: true },
      relations: ["modality"],
    });
    if (!enrollment.length) {
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
          .split(",")
          .map((loc) => loc.trim()),
      };
    });

    return res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/teacher", async (req, res) => {
  try {
    const query = req.query;

    const { id } = req.user;

    const teacher = await teacherRepository.findOne({
      where: { id },
      relations: ["modality"],
    });

    if (!teacher || teacher.modality) {
      return res.status(404).json({ error: "não vinculado a uma modalidade" });
    }
    const classes = teacher.modality;

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
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
