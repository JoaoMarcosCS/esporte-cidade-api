import { AppDataSource } from "../database/config";
import { Manager } from "../entities/manager.entity";
import { BaseAuthService } from "./base-auth.service";

export class ManagerAuthService extends BaseAuthService<Manager> {
  protected repository = AppDataSource.getRepository(Manager);

  protected async findUser({ email }: { email: string }) {
    return this.repository.findOne({ 
      where: { email },
      select: ['id', 'email', 'name', 'role', 'password']
    });
  }
   protected async findUserById(id:number ){
    console.log("Buscando MANAGER com ID:", id);
    return this.repository.findOne({
      where:{id},
      select:['id', 'email', 'name', 'role', 'password']
    })
  }

  protected getAccessTokenPayload(manager: Manager) {
    return {
      id: manager.id,
      email: manager.email,
      role: manager.role,
      type: 'manager'
    };
  }

  protected getUserResponse(manager: Manager) {
    return {
      id: manager.id,
      name: manager.name,
      email: manager.email,
      role: manager.role
    };
  }
}