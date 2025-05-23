import express, { Router, Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { Modality } from "../entities/modality.entity";

const modalityRepository = AppDataSource.getRepository(Modality);

export const modalityService = {
  async viewModality() {
    const modalities = await modalityRepository.find({where: { ativo: true }});
    const modalitiesWithArrays = modalities.map((mod) => ({
      ...mod,
      days_of_week: mod.days_of_week?.split(",").map((s) => s.trim()) || [],
      class_locations:
        mod.class_locations?.split(",").map((s) => s.trim()) || [],
    }));
    return modalitiesWithArrays;
  },

  async viewModalityById(id: number) {
    const modality = await modalityRepository.findOneBy({ id, ativo: true });
    if (!modality) {
      const error: any = new Error("Modalidade não encontrada");
      error.status = 404;
      throw error;
    }
    return {
      ...modality,
      days_of_week:
        modality.days_of_week?.split(",").map((s) => s.trim()) || [],
      class_locations:
        modality.class_locations?.split(",").map((s) => s.trim()) || [],
    };
  },

  async createModality(data: any) {
    const {
      name,
      description,
      days_of_week,
      start_time,
      end_time,
      class_locations,
    } = data;

    const existModality = await modalityRepository.findOneBy({ name });
    if (existModality) {
      const error: any = new Error("Modalidade já existente");
      error.status = 400;
      throw error;
    }

    const newModality = modalityRepository.create({
      name,
      description,
      days_of_week: Array.isArray(days_of_week)
        ? days_of_week.join(", ")
        : days_of_week,
      start_time,
      end_time,
      class_locations: Array.isArray(class_locations)
        ? class_locations.join(", ")
        : class_locations,
    });

    await modalityRepository.save(newModality);
    return { message: "Cadastro realizado com sucesso" };
  },

  async updateModality(id: number, data: any) {
    const modality = await modalityRepository.findOneBy({ id });
    if (!modality) {
      const error: any = new Error("Modalidade não encontrada");
      error.status = 404;
      throw error;
    }

    const updatedData = {
      ...data,
      days_of_week: Array.isArray(data.days_of_week)
        ? data.days_of_week.join(", ")
        : data.days_of_week,
      class_locations: Array.isArray(data.class_locations)
        ? data.class_locations.join(", ")
        : data.class_locations,
    };

    modalityRepository.merge(modality, updatedData);
    await modalityRepository.save(modality);
    return { message: "Modalidade atualizada com sucesso" };
  },

  async deleteModality(id: number) {
    const modality = await modalityRepository.findOneBy({ id });
    if (!modality) {
      const error: any = new Error("Modalidade não encontrada");
      error.status = 404;
      throw error;
    }

    modality.ativo = false;
    await modalityRepository.save(modality);

    return { message: "Modalidade desativada com sucesso" };
  },
};
