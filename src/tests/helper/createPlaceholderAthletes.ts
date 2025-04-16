import { AppDataSource } from "src/database/config";
import { Athlete } from "src/entities/athlete.entity";
import { athletesPlaceholder } from "./data";

const athleteRepository = AppDataSource.getRepository(Athlete);

export const createPlaceholderAthletes = async () => {
    for (var athlete of athletesPlaceholder)
    {
        const newAthlete = athleteRepository.create(athlete);
        await athleteRepository.save(newAthlete);
    }
}