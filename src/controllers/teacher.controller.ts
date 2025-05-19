import { Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { Teacher } from "../entities/teacher.entity";
import { Roles } from "../enums/roles.enum";
import bcrypt from "bcrypt";

const teacherRepository = AppDataSource.getRepository(Teacher);

export class TeacherController {
  static async getAll(req: Request, res: Response) {
    try {
      const teachers = await teacherRepository.find({
        relations: ["modality"],
      });
      res.json(teachers);
    } catch (error) {
      console.error("Erro ao buscar professores:", error.message);
      res.status(500).json({ message: "Erro ao buscar professores.", error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const teacherId = parseInt(req.params.id, 10);

      if (isNaN(teacherId)) {
        return res.status(400).json("ID de professor inválido.");
      }

      const teacher = await teacherRepository.findOneBy({ id: teacherId });
      if (!teacher) {
        return res.status(404).json("Professor não encontrado.");
      }

      res.status(200).json(teacher);
    } catch (error) {
      console.error("Erro ao buscar professor:", error);
      res.status(500).json("Erro ao buscar professor.");
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { id, ...data } = req.body;
      console.log("Dados recebidos no backend:", req.body)
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const teacher = teacherRepository.create({
        ...req.body,
        role: Roles.TEACHER,
        password: hashedPassword
      });

      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10); // Criptografando a senha
      }

      await teacherRepository.save(teacher);
      res.status(201).json(teacher);
    } catch (error) {
      console.error("Erro ao criar professor:", error);
      res.status(500).json("Erro ao criar professor.");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const teacherId = parseInt(req.params.id, 10);

      if (isNaN(teacherId)) {
        return res.status(400).json("ID de professor inválido.");
      }

      const teacher = await teacherRepository.findOneBy({ id: teacherId });
      if (!teacher) {
        return res.status(404).json("Professor não encontrado.");
      }

      teacher.name = req.body.name || teacher.name;
      teacher.cpf = req.body.cpf || teacher.cpf;
      teacher.rg = req.body.rg || teacher.rg;
      teacher.birthday = req.body.birthday || teacher.birthday;
      teacher.phone = req.body.phone || teacher.phone;
      teacher.photo_url = req.body.photo_url || teacher.photo_url;
      teacher.email = req.body.email || teacher.email;

      if (req.body.password) {
        teacher.password = await bcrypt.hash(req.body.password, 10); 
      }

      await teacherRepository.save(teacher);
      res.status(200).json(teacher);
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
      res.status(500).json("Erro ao atualizar professor.");
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const teacherId = parseInt(req.params.id, 10);

      if (isNaN(teacherId)) {
        return res.status(400).json("ID de professor inválido.");
      }

      const teacher = await teacherRepository.findOneBy({ id: teacherId });
      if (!teacher) {
        return res.status(404).json("Professor não encontrado.");
      }

      await teacherRepository.remove(teacher);
      res.status(200).json("Professor deletado com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar professor:", error);
      res.status(500).json("Erro ao deletar professor.");
    }
  }
}