import express, { Request, Response, RequestHandler, NextFunction } from "express";
import { AppDataSource } from "../database/config";
import { Schedule } from "../entities/schedule.entity";
import { Teacher } from "../entities/teacher.entity";
import { validate } from "class-validator";
import { Between } from "typeorm";

const router = express.Router();
const scheduleRepository = AppDataSource.getRepository(Schedule);
const teacherRepository = AppDataSource.getRepository(Teacher);

// Get schedules for a specific teacher
const getTeacherSchedules: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = parseInt(req.params.id, 10);
        
        if (isNaN(teacherId)) {
            res.status(400).json({ message: "ID de professor inválido." });
            return;
        }

        // Get today's date without time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get tomorrow's date without time
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get next day's date for range query
        const nextDay = new Date(tomorrow);
        nextDay.setDate(nextDay.getDate() + 1);

        console.log("Searching for schedules between:", {
            today: today.toISOString(),
            tomorrow: tomorrow.toISOString(),
            nextDay: nextDay.toISOString()
        });

        // Get today's schedules
        const todaySchedules = await scheduleRepository.find({
            where: {
                teacher: { id: teacherId },
                date: Between(today, tomorrow)
            },
            relations: ["teacher"],
            order: {
                time: "ASC"
            }
        });

        // Get tomorrow's schedules
        const tomorrowSchedules = await scheduleRepository.find({
            where: {
                teacher: { id: teacherId },
                date: Between(tomorrow, nextDay)
            },
            relations: ["teacher"],
            order: {
                time: "ASC"
            }
        });

        console.log("Found schedules:", {
            today: todaySchedules.length,
            tomorrow: tomorrowSchedules.length
        });

        res.status(200).json({
            today: todaySchedules,
            tomorrow: tomorrowSchedules
        });
    } catch (error) {
        console.error("Erro ao buscar horários:", error);
        res.status(500).json({ message: "Erro ao buscar horários." });
    }
};

// Create multiple schedules for a teacher
const createTeacherSchedules: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = parseInt(req.params.id, 10);
        
        if (isNaN(teacherId)) {
            res.status(400).json({ message: "ID de professor inválido." });
            return;
        }

        const teacher = await teacherRepository.findOneBy({ id: teacherId });
        if (!teacher) {
            res.status(404).json({ message: "Professor não encontrado." });
            return;
        }

        const schedules = req.body as { name: string; time: string; date: string }[];
        const newSchedules = schedules.map(schedule => {
            return scheduleRepository.create({
                ...schedule,
                teacher,
                date: new Date(schedule.date)
            });
        });

        await scheduleRepository.save(newSchedules);
        res.status(201).json(newSchedules);
    } catch (error) {
        console.error("Erro ao criar horários:", error);
        res.status(500).json({ message: "Erro ao criar horários." });
    }
};

// Delete a specific schedule
const deleteSchedule: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scheduleId = parseInt(req.params.id, 10);
        
        if (isNaN(scheduleId)) {
            res.status(400).json({ message: "ID de horário inválido." });
            return;
        }

        const schedule = await scheduleRepository.findOneBy({ id: scheduleId });
        if (!schedule) {
            res.status(404).json({ message: "Horário não encontrado." });
            return;
        }

        await scheduleRepository.remove(schedule);
        res.status(200).json({ message: "Horário removido com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar horário:", error);
        res.status(500).json({ message: "Erro ao deletar horário." });
    }
};

// Register routes
router.get("/teacher/:id", getTeacherSchedules);
router.post("/teacher/:id", createTeacherSchedules);
router.delete("/:id", deleteSchedule);

export default router;
