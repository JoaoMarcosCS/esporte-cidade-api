import { Request, Response } from 'express';
import { Athlete } from '../entities/athlete.entity';
import { AppDataSource } from '../database/config';
import { Roles } from '../enums/roles.enum';

export class AthleteController {
    private athleteRepository = AppDataSource.getRepository(Athlete);

    async listAthletes(req: Request, res: Response) {
        try {
            const athletes = await this.athleteRepository.find();
            res.json(athletes);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar atletas' });
        }
    }

    async createAthlete(req: Request, res: Response) {
        try {
            const { name, cpf, rg, birthday, phone, photo_url, email, password } = req.body;
            const athlete = this.athleteRepository.create({
                name,
                cpf,
                rg,
                birthday,
                phone,
                photo_url,
                email,
                password,
                role: Roles.ATHLETES
            });
            
            await this.athleteRepository.save(athlete);
            res.status(201).json(athlete);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar atleta' });
        }
    }

    async getAthleteById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const athlete = await this.athleteRepository.findOne({
                where: { id: parseInt(id) }
            });
            
            if (!athlete) {
                res.status(404).json({ message: 'Atleta não encontrado' });
                return;
            }
            
            res.json(athlete);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar atleta' });
        }
    }

    async updateAthlete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const athlete = await this.athleteRepository.findOne({
                where: { id: parseInt(id) }
            });
            
            if (!athlete) {
                res.status(404).json({ message: 'Atleta não encontrado' });
                return;
            }

            const { name, cpf, rg, birthday, phone, photo_url, email, password } = req.body;
            
            Object.assign(athlete, {
                name,
                cpf,
                rg,
                birthday,
                phone,
                photo_url,
                email,
                password
            });

            await this.athleteRepository.save(athlete);
            res.json(athlete);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar atleta' });
        }
    }

    async deleteAthlete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const athlete = await this.athleteRepository.findOne({
                where: { id: parseInt(id) }
            });
            
            if (!athlete) {
                res.status(404).json({ message: 'Atleta não encontrado' });
                return;
            }

            await this.athleteRepository.remove(athlete);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar atleta' });
        }
    }
}
