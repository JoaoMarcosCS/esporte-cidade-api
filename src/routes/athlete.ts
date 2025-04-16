import express from "express";
import { AthleteController } from "../controllers/athlete.controller";

const router = express.Router();
const athleteController = new AthleteController();

// Rota para listar atletas
router.get("/athletes", athleteController.listAthletes);

// Rota para criar atleta
router.post("/athletes", athleteController.createAthlete);

// Rota para buscar atleta por ID
router.get("/athletes/:id", athleteController.getAthleteById);

// Rota para atualizar atleta
router.put("/athletes/:id", athleteController.updateAthlete);

// Rota para deletar atleta
router.delete("/athletes/:id", athleteController.deleteAthlete);

export default router;
