import express, { Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { Athlete } from "../entities/athlete.entity";
import { Modality } from "../entities/modality.entity";
import { Enrollment } from "../entities/enrollment.entity";

const router = express.Router();
const enrollmentRepository = AppDataSource.getRepository(Enrollment);

router.post("/", async (req: Request, res: Response) => {
    try {
        const { athleteId, modalityId } = req.body;

        const athlete = await AppDataSource.getRepository(Athlete).findOneBy({ id: athleteId });
        const modality = await AppDataSource.getRepository(Modality).findOneBy({ id: modalityId });

        const enrollment = enrollmentRepository.create(
            {
                athlete,
                modality
            }
        );
        await enrollmentRepository.save(enrollment);
        res.status(201).json(enrollment);
    } catch (error) {
        console.error("error message", error.message);

        res.status(500).json({ message: "error message", error: error.message });
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const filters = req.params;
        const enrollments = await enrollmentRepository.find();

        console.log("\n\n");        
        console.log(filters);        
        console.log("\n\n");        

        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
