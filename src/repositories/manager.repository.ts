import { Repository, EntityRepository } from "typeorm";
import { Manager } from "../entities/manager.entity";

@EntityRepository(Manager)
export class ManagerRepository extends Repository<Manager> {
    async updateProfile(
        id: number,
        data: Partial<Manager>
    ): Promise<Manager> {
        const manager = await this.findOne(id);
        
        if (!manager) {
            throw new Error("Gerente não encontrado");
        }

        Object.assign(manager, data);
        return this.save(manager);
    }
}
