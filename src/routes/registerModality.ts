import express from "express";
import { assignTeacherToModality, createModality, deleteModality, updateModality, viewModalities, viewModalityById } from "../controllers/modality.controller";

const router = express.Router();
router.get("/all", viewModalities)
router.get("/single/:id", viewModalityById)
router.post("/create", createModality) 
router.put("/update/:id", updateModality)
router.delete("/delete/:id", deleteModality)
router.put("/assign-teacher/:modalityId", assignTeacherToModality);

export default router; 