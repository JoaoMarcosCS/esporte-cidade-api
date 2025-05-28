import { AppDataSource } from "../database/config";
import { Athlete } from "../entities/athlete.entity";
import { BaseAuthService } from "./base-auth.service";

export class AthleteAuthService extends BaseAuthService<Athlete> {
  protected repository = AppDataSource.getRepository(Athlete);

  protected async findUser({ cpf }: { cpf: string }) {
    return this.repository.findOne({ 
      where: { cpf },
      select: ['id', 'cpf', 'name', 'role', 'password']
    });
  }

  protected async findUserById(id:number){
     console.log("Buscando ATLETA com ID:", id);
    return this.repository.findOne({
      where:{id},
      select:['id', 'cpf', 'name', 'role', 'password']
    })
  }

  protected getAccessTokenPayload(athlete: Athlete) {
    return {
      id: athlete.id,
      cpf: athlete.cpf,
      role: athlete.role,
      type: 'athlete'
    };
  }

  protected getUserResponse(athlete: Athlete) {
    return {
      id: athlete.id,
      name: athlete.name,
      cpf: athlete.cpf,
      role: athlete.role
    };
  }
}