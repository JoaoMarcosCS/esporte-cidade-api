import { AppDataSource } from "../database/config";
import { Athlete } from "../entities/athlete.entity";
import { Teacher } from "../entities/teacher.entity";
import { Enrollment } from "../entities/enrollment.entity";
import { Modality } from "../entities/modality.entity";

const teacherRepository = AppDataSource.getRepository(Teacher);
const athleteRepository = AppDataSource.getRepository(Athlete);
const enrollmentRepository = AppDataSource.getRepository(Enrollment);
const modalityRepository = AppDataSource.getRepository(Modality);

export const schedule = {
  //atleta
  async athleteClasses(id: number) {
    const enrollment = await enrollmentRepository.findOne({
      where: { athlete:{id}, active:true },
      relations:["modality"]
    });
    if (!enrollment) {
      throw new Error("Matrícula não encontrada.");
    }

    const modalityId = enrollment.modality.id;
   

    const classes = await modalityRepository.findOne({
        where:{id: modalityId},
        select:["name", "days_of_week", "start_time", "end_time", "class_locations"]
    });
    const classLocationsArray = classes?.class_locations.split(",");
  },
};
