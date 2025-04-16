import { AppDataSource } from "src/database/config";
import { Modality } from "src/entities/modality.entity";
import { modalitiesPlaceholder } from "./data";

const modalityRepository = AppDataSource.getRepository(Modality);

export const createPlaceholderModalities = async () => {
    for (var modality of modalitiesPlaceholder)
    {
        await modalityRepository.save(modality);
    }
}