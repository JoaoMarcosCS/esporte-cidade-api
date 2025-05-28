import { AppDataSource } from "../database/config";
import { Teacher } from "../entities/teacher.entity";
import { BaseAuthService } from "./base-auth.service";
import { authConfig } from "../config/auth";

export class TeacherAuthService extends BaseAuthService<Teacher> {
  protected repository = AppDataSource.getRepository(Teacher);

  protected async findUser({ email }: { email: string }) {
    return this.repository.findOne({
      where: { email },
      relations: ["modality"],
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        rg: true,
        birthday: true,
        phone: true,
        photo_url: true,
        about: true,
        role: true,
        password: true,
        modality: {
          id: true,
          name: true,
          description: true,
        },
      },
    });
  }

  protected async findUserById(id: number ) {
    console.log("Buscando PROFESSOR com ID:", id);
    return this.repository.findOne({
      where: { id },
      relations: ["modality"],
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        rg: true,
        birthday: true,
        phone: true,
        photo_url: true,
        about: true,
        role: true,
        password: true,
        modality: {
          id: true,
          name: true,
          description: true,
        },
      },
    });
  }

  protected getAccessTokenPayload(teacher: Teacher) {
    return {
      id: teacher.id,
      email: teacher.email,
      role: teacher.role,
      type: "teacher",
    };
  }

  protected getUserResponse(teacher: Teacher) {
    return {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      cpf: teacher.cpf,
      rg: teacher.rg,
      birthday: teacher.birthday,
      phone: teacher.phone,
      photo_url: teacher.photo_url,
      about: teacher.about,
      modality: teacher.modality
        ? {
            id: teacher.modality.id,
            name: teacher.modality.name,
            description: teacher.modality.description,
          }
        : null,
      role: teacher.role,
    };
  }
}
