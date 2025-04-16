import express, { Router, Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { Athlete } from "../entities/athlete.entity";
import { Roles } from "../enums/roles.enum";
import { cpf } from 'cpf-cnpj-validator'; 
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const athleteRepository = AppDataSource.getRepository(Athlete);
const saltRounds = 10;

router.post("/", 
  //validação das informações
  [
    body('name').notEmpty().withMessage('Nome é obrigatório')
               .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
    body('cpf').notEmpty().withMessage('CPF é obrigatório')
               .custom(value => cpf.isValid(value)).withMessage('CPF inválido'), 
    body('email').isEmail().withMessage('Email inválido')
                 .normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Senha deve ter pelo menos 8 caracteres'),
    body('birthday').isDate().withMessage('Data de nascimento inválida'),
    body('phone').notEmpty().withMessage('Telefone é obrigatório'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        name, cpf: cpfInput, rg, birthday, phone, photo_url, email, password, 
        fatherName, fatherPhone, fatherCpf, fatherEmail, 
        motherName, motherPhone, motherCpf, motherEmail, 
        responsibleName, responsibleEmail, responsibleCpf, 
        bloodType, frontIdPhotoUrl, backIdPhotoUrl, foodAllergies
      } = req.body;

      const formattedCpf = cpfInput.replace(/\D/g, '');

      // checar se ja tem um usuario no banco
      const isThereAnyAthlete = await athleteRepository.findOneBy({ cpf: formattedCpf });
      if (isThereAnyAthlete) {
        res.status(400).json({ message: "Este CPF já está cadastrado" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newAthlete = athleteRepository.create({
        name,
        password: hashedPassword,
        cpf: formattedCpf,
        rg,
        birthday,
        phone,
        photo_url,
        email,
        father_name: fatherName,
        father_phone: fatherPhone,
        father_cpf: fatherCpf,
        father_email: fatherEmail,
        mother_name: motherName,
        mother_phone: motherPhone,
        mother_cpf: motherCpf,
        mother_email: motherEmail,
        responsible_person_name: responsibleName,
        responsible_person_email: responsibleEmail,
        responsible_person_cpf: responsibleCpf,
        blood_type: bloodType,
        photo_url_cpf_front: frontIdPhotoUrl,
        photo_url_cpf_back: backIdPhotoUrl,
        allergy: foodAllergies,
        role: Roles.ATHLETES,
      });

      await athleteRepository.save(newAthlete);

      res.status(201).json({ 
        success: true,
        message: "Cadastro realizado com sucesso",
        user: {
          id: newAthlete.id,
          name: newAthlete.name,
          email: newAthlete.email,
          role: newAthlete.role
          // Exclude password, CPF and other sensitive data
        }
      });

    } catch (error) {
      console.error("Erro ao cadastrar atleta:", error);
      res.status(500).json({ 
        message: "Erro interno do servidor",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

export default router;