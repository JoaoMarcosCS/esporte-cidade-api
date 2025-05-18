import { AppDataSource } from "../config";
import { Manager } from "../../entities/manager.entity";
import { Roles } from "../../enums/roles.enum";
import bcrypt from "bcrypt";

async function seedManager() {
  await AppDataSource.initialize();

  const managerRepository = AppDataSource.getRepository(Manager);

  const uniqueEmail = "gestor" + Date.now() + "@esportecidade.com";
  const existing = await managerRepository.findOneBy({ email: uniqueEmail });
  if (existing) {
    console.log("Gestor já existe.");
    console.log("Dados do gestor existente:", existing);
    await AppDataSource.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash("123123", 10);

  const manager = managerRepository.create({
    name: "Gestor Completo",
    email: uniqueEmail,
    password: hashedPassword,
    role: 3,
    cpf: "12345678900",
    rg: "MG1234567",
    birthday: "1980-01-01",
    phone: "31999999999",
    photo_url: "https://ui-avatars.com/api/?name=Gestor+Completo",
  });

  await managerRepository.save(manager);
  console.log("Gestor criado com sucesso! Email:", uniqueEmail);
  await AppDataSource.destroy();
}

seedManager().catch((err) => {
  console.error("Erro ao criar gestor:", err);
});

