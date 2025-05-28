import { Request, Response } from "express";
import { modalityService } from "../services/register-modality.service";
export const createModality = async (req: Request, res: Response) => {
  try {
    const result = await modalityService.createModality(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Erro ao criar modalidade." });
  }
};

export const viewModalities = async (req: Request, res: Response) => {
  try {
    const modalities = await modalityService.viewModality();
    res.status(200).json(modalities);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Erro ao buscar modalidades." });
  }
};

export const viewModalityById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const modality = await modalityService.viewModalityById(id);
    res.status(200).json(modality);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Erro ao buscar modalidade." });
  }
};

export const updateModality = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await modalityService.updateModality(id, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Erro ao atualizar modalidade." });
  }
};

export const deleteModality = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await modalityService.deleteModality(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Erro ao excluir modalidade." });
  }
};

export const assignTeacherToModality = async (req: Request, res: Response) => {
  try {
    const modalityId = Number(req.params.modalityId);
    const { teacherId } = req.body;

    const result = await modalityService.assignTeacherToModality(modalityId, teacherId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({
      message: error.message || "Erro ao atribuir professor à modalidade.",
    });
  }
};

