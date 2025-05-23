import "reflect-metadata";
import { createConnection, LessThanOrEqual } from "typeorm";
import { faker } from "@faker-js/faker";
import { Athlete } from "../entities/athlete.entity";
import { AppDataSource } from "../database/config";
import { Roles } from "../enums/roles.enum";
import bcrypt from "bcrypt";
import { Modality } from "../entities/modality.entity";
import { Teacher } from "../entities/teacher.entity";
import { Manager } from "../entities/manager.entity";
import { Enrollment } from "../entities/enrollment.entity";
import { Atendiment } from "../entities/atendiment.entity";
import {
  startOfYear,
  eachMonthOfInterval,
  eachDayOfInterval,
  endOfMonth,
  format,
  isWeekend,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Address } from "../entities/address.entity";

export const seedOfAllEntities = async () => {
  const athleteRepository = AppDataSource.getRepository(Athlete);
  const addressRepository = AppDataSource.getRepository(Address);

  // Gerar 10 atletas
  for (let i = 0; i < 40; i++) {
    const athlete = new Athlete();

    // Dados básicos (herdados de UserBase)
    athlete.name = faker.person.fullName();
    athlete.email = faker.internet.email({
      firstName: athlete.name.split(" ")[0],
    });
    athlete.password = await bcrypt.hash(`senha${i}`, 1);
    athlete.phone = faker.phone.number({ style: "national" });
    athlete.cpf = faker.string.numeric(11);
    athlete.birthday = faker.date
      .birthdate({ min: 25, max: 60, mode: "age" })
      .toISOString()
      .split("T")[0];
    athlete.role = Roles.ATHLETES;

    // Dados do pai
    athlete.father_name = faker.person.fullName({ sex: "male" });
    athlete.father_phone = faker.phone.number({ style: "national" });
    athlete.father_cpf = faker.string.numeric(11); // CPF fictício
    athlete.father_email = faker.internet.email({
      firstName: athlete.father_name.split(" ")[0],
    });

    // Dados da mãe
    athlete.mother_name = faker.person.fullName({ sex: "female" });
    athlete.mother_phone = faker.phone.number({ style: "national" });
    athlete.mother_cpf = faker.string.numeric(11);
    athlete.mother_email = faker.internet.email({
      firstName: athlete.mother_name.split(" ")[0],
    });

    // Responsável (pode ser pai, mãe ou outro)
    athlete.responsible_person_name = faker.helpers.arrayElement([
      athlete.father_name,
      athlete.mother_name,
      faker.person.fullName(),
    ]);
    athlete.responsible_person_email = faker.internet.email({
      firstName: athlete.responsible_person_name.split(" ")[0],
    });
    athlete.responsible_person_cpf = faker.string.numeric(11);

    // Saúde
    athlete.blood_type = faker.helpers.arrayElement([
      "A+",
      "B+",
      "AB+",
      "O+",
      "A-",
      "B-",
      "AB-",
      "O-",
    ]);
    athlete.allergy = faker.helpers.arrayElement([
      "Nenhuma alergia informada",
      "Amendoim",
      "Glúten",
      "Lactose",
      "Penicilina",
    ]);

    athlete.photo_url = faker.image.avatar();

    // Fotos do CPF (URLs fictícias)
    athlete.photo_url_cpf_front = faker.image.urlLoremFlickr({
      category: "document",
    });
    athlete.photo_url_cpf_back = faker.image.urlLoremFlickr({
      category: "document",
    });

    await athleteRepository.save(athlete);
    console.log(`Atleta criado: ${athlete.name} (ID: ${athlete.id})`);
  }

    var athlete1 = new Athlete();
    athlete1.name = faker.person.fullName();
    athlete1.email = "teste@gmail.com"
    athlete1.password = "senha12345"
    athlete1.phone = faker.phone.number({ style: "national" });
    athlete1.cpf = faker.string.numeric(11);
    athlete1.birthday = faker.date
      .birthdate({ min: 25, max: 60, mode: "age" })
      .toISOString()
      .split("T")[0];
    athlete1.role = Roles.ATHLETES;

    // Dados do pai
    athlete1.father_name = faker.person.fullName({ sex: "male" });
    athlete1.father_phone = faker.phone.number({ style: "national" });
    athlete1.father_cpf = faker.string.numeric(11); // CPF fictício
    athlete1.father_email = faker.internet.email({
      firstName: athlete1.father_name.split(" ")[0],
    });

    // Dados da mãe
    athlete1.mother_name = faker.person.fullName({ sex: "female" });
    athlete1.mother_phone = faker.phone.number({ style: "national" });
    athlete1.mother_cpf = faker.string.numeric(11);
    athlete1.mother_email = faker.internet.email({
      firstName: athlete1.mother_name.split(" ")[0],
    });

    // Responsável (pode ser pai, mãe ou outro)
    athlete1.responsible_person_name = faker.helpers.arrayElement([
      athlete1.father_name,
      athlete1.mother_name,
      faker.person.fullName(),
    ]);
    athlete1.responsible_person_email = faker.internet.email({
      firstName: athlete1.responsible_person_name.split(" ")[0],
    });
    athlete1.responsible_person_cpf = faker.string.numeric(11);

    // Saúde
    athlete1.blood_type = faker.helpers.arrayElement([
      "A+",
      "B+",
      "AB+",
      "O+",
      "A-",
      "B-",
      "AB-",
      "O-",
    ]);
    athlete1.allergy = faker.helpers.arrayElement([
      "Nenhuma alergia informada",
      "Amendoim",
      "Glúten",
      "Lactose",
      "Penicilina",
    ]);

    athlete1.photo_url = faker.image.avatar();

    // Fotos do CPF (URLs fictícias)
    athlete1.photo_url_cpf_front = faker.image.urlLoremFlickr({
      category: "document",
    });
    athlete1.photo_url_cpf_back = faker.image.urlLoremFlickr({
      category: "document",
    });

  await athleteRepository.save(athlete1);

  console.log("✅ Seed de atletas concluído!");

  const modalityRepository = AppDataSource.getRepository(Modality);

  // Dados fictícios para modalidades esportivas
  const sports = [
    { name: "Futebol", description: "Treinos de futebol infantil e juvenil" },
    { name: "Vôlei", description: "Aulas de vôlei para todas as idades" },
    { name: "Basquete", description: "Desenvolvimento de fundamentos" },
    { name: "Natação", description: "Aulas para iniciantes e avançados" },
    { name: "Judô", description: "Arte marcial para crianças" },
  ];

  const _athletes = await athleteRepository.find();

  for (let i = 0; i < 40; i++) {
    const state = faker.location.state();
    const city = faker.location.city();

    const address = new Address();
    address.state = state;
    address.city = city;
    address.neighborhood = faker.location.county();
    address.street = faker.location.street();
    address.number = faker.number.int({ min: 1, max: 9999 });
    address.complement = faker.helpers.arrayElement([
      "Casa",
      "Apartamento 101",
      "Bloco B",
      "Fundos",
      "Sobrado",
      "Bloco A",
      "Apartamento 100",
      "",
    ]);
    address.references = faker.helpers.arrayElement([
      "Próximo ao mercado",
      "Em frente à praça",
      "Ao lado da escola",
      "Casa de esquina",
      "Perto onde judas perdeu as botas",
    ]);

    await addressRepository.save(address);

    console.log(
      `Endereço criado para ${_athletes[i].name}: ${address.street}, ${address.number}`
    );

    _athletes[i].address = address;

    await athleteRepository.save(_athletes[i]);

    console.log(
      `Atleta ${_athletes[i].name} recebeu o endereço ${address.street}, ${address.number}`
    );
  }

  for (const sport of sports) {
    const modality = new Modality();

    modality.name = sport.name;
    modality.description = sport.description;

    // Dias da semana aleatórios (ex: "seg,qua,sex")
    modality.days_of_week = faker.helpers
      .arrayElements(["seg", "ter", "qua", "qui", "sex", "sab", "dom"], {
        min: 2,
        max: 4,
      })
      .join(",");

    // Horários realistas
    const today = new Date();

    // Horário de início entre 8h e 16h
    const startTime = new Date(today);
    startTime.setHours(faker.number.int({ min: 8, max: 16 }));
    startTime.setMinutes(faker.helpers.arrayElement([0, 15, 30, 45]));
    modality.start_time = startTime.toTimeString().substring(0, 5); // Formato "HH:mm"

    // Horário de término (1h a 2h depois do início)
    const endTime = new Date(startTime);
    endTime.setHours(
      startTime.getHours() + faker.number.int({ min: 1, max: 2 })
    );
    modality.end_time = endTime.toTimeString().substring(0, 5);
    // Locais fictícios (ex: "Quadra A,Ginásio B")
    modality.class_locations = faker.helpers
      .arrayElements(
        [
          "Quadra Principal",
          "Ginásio Central",
          "Campo de Futebol",
          "Piscina Olímpica",
          "Sala de Artes Marciais",
        ],
        { min: 1, max: 2 }
      )
      .join(",");

    await modalityRepository.save(modality);
    console.log(`Modalidade criada: ${modality.name}`);
  }

  const teacherRepository = AppDataSource.getRepository(Teacher);

  // Busca modalidades existentes
  const modalities = await modalityRepository.find();
  if (modalities.length === 0) {
    throw new Error(
      "Nenhuma modalidade encontrada. Rode seedModalities() primeiro!"
    );
  }

  // Gera 5 professores
  for (let i = 0; i < 5; i++) {
    const teacher = new Teacher();

    // Dados de UserBase
    teacher.name = faker.person.fullName();
    teacher.email = faker.internet.email({
      firstName: teacher.name.split(" ")[0],
    });
    teacher.cpf = faker.string.numeric(11);
    teacher.rg = faker.string.numeric(9);
    teacher.birthday = faker.date
      .birthdate({ min: 25, max: 60, mode: "age" })
      .toISOString()
      .split("T")[0];
    teacher.phone = faker.phone.number({ style: "national" });
    teacher.photo_url = faker.image.avatar();
    teacher.role = Roles.TEACHER;

    // Criptografa senha (padrão: "senha123")
    teacher.password = await bcrypt.hash(`senha${i}`, 10);

    // Campos específicos de Teacher
    teacher.about = faker.lorem.paragraph();
    teacher.modality = modalities[i];

    const state = faker.location.state();
    const city = faker.location.city();

    const address = new Address();
    address.state = state;
    address.city = city;
    address.neighborhood = faker.location.county();
    address.street = faker.location.street();
    address.number = faker.number.int({ min: 1, max: 9999 });
    address.complement = faker.helpers.arrayElement([
      "Casa",
      "Apartamento 101",
      "Bloco B",
      "Fundos",
      "Sobrado",
      "Bloco A",
      "Apartamento 100",
      "",
    ]);
    address.references = faker.helpers.arrayElement([
      "Próximo ao mercado",
      "Em frente à praça",
      "Ao lado da escola",
      "Casa de esquina",
      "Perto onde judas perdeu as botas",
    ]);

    await addressRepository.save(address);

    console.log(
      `Endereço criado para ${teacher.name}: ${address.street}, ${address.number}`
    );

    teacher.address = address;

    await teacherRepository.save(teacher);
    console.log(
      `Professor criado: ${teacher.name} | Modalidade: ${teacher.modality.name}`
    );
  }

  let teacherDemo = new Teacher();

  teacherDemo.email = "teste@gmail.com";
  teacherDemo.password = await bcrypt.hash(`senha12345`, 10);
  teacherDemo.name = faker.person.fullName();
  teacherDemo.cpf = faker.string.numeric(11); // Gera CPF sem formatação
  teacherDemo.rg = faker.string.numeric(9);
  teacherDemo.birthday = faker.date
    .birthdate({ min: 25, max: 60, mode: "age" })
    .toISOString()
    .split("T")[0];
  teacherDemo.phone = faker.phone.number({ style: "national" }); // Sem formatação
  teacherDemo.photo_url = faker.image.avatar();
  teacherDemo.role = Roles.TEACHER;
  teacherDemo.about = faker.lorem.paragraph();
  teacherDemo.modality = modalities[0];

  const state = faker.location.state();
  const city = faker.location.city();

  const address = new Address();
  address.state = state;
  address.city = city;
  address.neighborhood = faker.location.county();
  address.street = faker.location.street();
  address.number = faker.number.int({ min: 1, max: 9999 });
  address.complement = faker.helpers.arrayElement([
    "Casa",
    "Apartamento 101",
    "Bloco B",
    "Fundos",
    "Sobrado",
    "Bloco A",
    "Apartamento 100",
    "",
  ]);
  address.references = faker.helpers.arrayElement([
    "Próximo ao mercado",
    "Em frente à praça",
    "Ao lado da escola",
    "Casa de esquina",
    "Perto onde judas perdeu as botas",
  ]);

  await addressRepository.save(address);

  console.log(
    `Endereço criado para ${teacherDemo.name}: ${address.street}, ${address.number}`
  );

  teacherDemo.address = address;

  await teacherRepository.save(teacherDemo);

  console.log(
    `Professor criado: ${teacherDemo.name} | Modalidade: ${teacherDemo.modality.name}`
  );

  const managerRepository = AppDataSource.getRepository(Manager);

  // Gera 3 gestores (ou a quantidade que desejar)
  for (let i = 0; i < 3; i++) {
    const manager = new Manager();

    // Dados de UserBase
    manager.name = faker.person.fullName();
    manager.email = faker.internet.email({
      firstName: manager.name.split(" ")[0],
    });
    manager.cpf = faker.string.numeric(11); // CPF sem formatação
    manager.rg = faker.string.numeric(9);
    manager.birthday = faker.date
      .birthdate({ min: 30, max: 65, mode: "age" })
      .toISOString()
      .split("T")[0];
    manager.phone = faker.phone.number({ style: "national" }); // Sem formatação
    manager.photo_url = faker.image.avatar();
    manager.role = Roles.MANAGER; // Definindo a role como MANAGER

    // Criptografa senha (padrão: "senha123")
    manager.password = await bcrypt.hash("senha123", 10);

    const state = faker.location.state();
    const city = faker.location.city();

    const address = new Address();
    address.state = state;
    address.city = city;
    address.neighborhood = faker.location.county();
    address.street = faker.location.street();
    address.number = faker.number.int({ min: 1, max: 9999 });
    address.complement = faker.helpers.arrayElement([
      "Casa",
      "Apartamento 101",
      "Bloco B",
      "Fundos",
      "Sobrado",
      "Bloco A",
      "Apartamento 100",
      "",
    ]);
    address.references = faker.helpers.arrayElement([
      "Próximo ao mercado",
      "Em frente à praça",
      "Ao lado da escola",
      "Casa de esquina",
      "Perto onde judas perdeu as botas",
    ]);

    await addressRepository.save(address);

    console.log(
      `Endereço criado para ${manager.name}: ${address.street}, ${address.number}`
    );

    manager.address = address;

    await managerRepository.save(manager);
    console.log(`Gestor criado: ${manager.name} | Email: ${manager.email}`);
  }

  const managerDemo = new Manager();

    // Dados de UserBase
    managerDemo.name = faker.person.fullName();
    managerDemo.email = "teste@gmail.com"
    managerDemo.cpf = faker.string.numeric(11); // CPF sem formatação
    managerDemo.rg = faker.string.numeric(9);
    managerDemo.birthday = faker.date
      .birthdate({ min: 30, max: 65, mode: "age" })
      .toISOString()
      .split("T")[0];
    managerDemo.phone = faker.phone.number({ style: "national" }); // Sem formatação
    managerDemo.photo_url = faker.image.avatar();
    managerDemo.role = Roles.MANAGER; // Definindo a role como managerDemo

    // Criptografa senha (padrão: "senha123")
    managerDemo.password = await bcrypt.hash("senha12345", 10)

  await managerRepository.save(managerDemo);

  const enrollmentRepository = AppDataSource.getRepository(Enrollment);

  // Busca todos os atletas e modalidades
  const athletes = await athleteRepository.find();

  if (athletes.length === 0 || modalities.length === 0) {
    throw new Error(
      "É necessário ter atletas e modalidades cadastrados primeiro!"
    );
  }

  // Para cada atleta...
  for (const athlete of athletes) {
    // ...inscreve em TODAS as modalidades
    for (const modality of modalities) {
      const enrollment = new Enrollment();

      // Define status aleatórios respeitando a regra
      enrollment.approved = faker.number.float({ min: 0, max: 1 }) <= 0.9;
      enrollment.active =
        enrollment.approved && faker.number.float({ min: 0, max: 1 }) <= 0.9; // Só ativa se aprovada

      // Datas realistas (últimos 6 meses)
      enrollment.created_at = faker.date.between({
        from: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 dias atrás
        to: new Date(),
      });
      enrollment.updated_at = faker.date.between({
        from: enrollment.created_at,
        to: new Date(),
      });

      // Associa atleta e modalidade
      enrollment.athlete = athlete;
      enrollment.modality = modality;

      await enrollmentRepository.save(enrollment);

      console.log(
        `Inscrição: ${athlete.name} -> ${modality.name} | ` +
          `Status: ${enrollment.approved ? "Aprovada" : "Recusada"} ` +
          `${enrollment.active ? "e Ativa" : " e Inativa"}`
      );
    }
  }

  const atendimentRepository = AppDataSource.getRepository(Atendiment);

  // modalidade -> meses -> dias -> atletas ativos (consulta)
  const year = new Date().getFullYear();
  const startDate = startOfYear(new Date(year, 0, 1));

  // 1. Obter todas as modalidades

  // 2. Iterar sobre cada modalidade
  for (const modality of modalities) {
    console.log(`\nProcessando modalidade: ${modality.name}`);

    // 3. Obter todos os tres primeiros meses do ano
    const months = eachMonthOfInterval({
      start: startDate,
      end: new Date(year, 2, 31),
    });

    // 4. Iterar sobre cada mês
    for (const month of months) {
      const monthName = format(month, "MMMM", { locale: ptBR });
      console.log(`\n  Mês: ${monthName}`);

      // 5. Obter todos os dias do mês (exceto finais de semana)
      const daysInMonth = eachDayOfInterval({
        start: month,
        end: endOfMonth(month),
      });

      // 6. Iterar sobre cada dia útil
      for (const day of daysInMonth) {
        const formattedDate = format(day, "yyyy-MM-dd");
        console.log(`    Dia: ${formattedDate}`);

        // 7. Buscar atletas ativos APENAS para esta modalidade e data
        const activeEnrollments = await enrollmentRepository.find({
          where: {
            modality: { id: modality.id },
            approved: true,
            active: true,
            // Adicione esta condição se houver datas de início/término
            // start_date: LessThanOrEqual(day),
            // end_date: MoreThanOrEqual(day)
          },
          relations: ["athlete"],
        });

        if (activeEnrollments.length === 0) {
          console.log("Nenhum atleta ativo. Pulando...");
          continue;
        }

        console.log(`${activeEnrollments.length} atletas ativos`);

        // 8. Gerar atendimentos para cada atleta ativo
        const dailyAtendimentos = activeEnrollments.map((enrollment) => {
          const present = faker.number.float({ min: 0, max: 1 }) <= 0.98;

          return atendimentRepository.create({
            modality,
            athlete: enrollment.athlete,
            present,
            description: present
              ? "Aula normal"
              : `Falta: ${faker.lorem.sentence()}`,
            created_at: day,
          });
        });

        // 9. Salvar em batch (lote) para o dia
        await atendimentRepository.save(dailyAtendimentos);
        console.log(
          `      ${dailyAtendimentos.length} atendimentos registrados`
        );

        const atendimentosComFalta = dailyAtendimentos.filter(
          (p) => !p.present
        );

        console.log(`Verificando inatividade por faltas`);

        atendimentosComFalta.forEach(async (atendimento) => {
          const totalFaltasAtleta = await atendimentRepository.count({
            where: {
              modality: { id: modality.id },
              athlete: { id: atendimento.athlete.id },
              present: false,
            },
          });

          if (totalFaltasAtleta > 2) {
            await enrollmentRepository.update(
              {
                athlete: { id: atendimento.athlete.id },
                modality: { id: modality.id },
              },
              { active: false }
            );
            console.log(
              `Atleta ${atendimento.athlete.name} INATIVADO por ${totalFaltasAtleta} faltas`
            );
          }
        });
      }
    }
  }
  // for (const modality of modalities) {
  //   console.log(`\nProcessando modalidade: ${modality.name}`);

  //   // Gera 30 dias de chamadas (consecutivos)
  //   for (let day = 0; day < 30; day++) {
  //     // const currentDate = addDays(startDate, day);

  //     // Busca TODOS os atletas ativos nesta modalidade na data atual
  //     const activeEnrollments = await enrollmentRepository.find({
  //       where: {
  //         modality: { id: modality.id },
  //         approved: true,
  //         active: true,
  //       },
  //       relations: ["athlete"],
  //     });

  //     if (activeEnrollments.length === 0) {
  //       console.log(`Dia ${day + 1}: Nenhum atleta ativo. Pulando...`);
  //       continue;
  //     }

  //     console.log(`Dia ${day + 1}: ${activeEnrollments.length} atletas ativos`);

  //     // Para cada atleta ativo, registra presença/ausência
  //     for (const enrollment of activeEnrollments) {
  //       const atendiment = new Atendiment();
  //       atendiment.modality = modality;
  //       atendiment.athlete = enrollment.athlete;
  //       atendiment.description = faker.lorem.sentence();

  //       // 80% chance de presença (ajustável)
  //       atendiment.present = faker.number.float({ min: 0, max: 1 }) <= 0.95;
  //       atendiment.created_at = currentDate;

  //       await atendimentRepository.save(atendiment);

  //       // Verifica faltas somente se o atleta faltou
  //       if (!atendiment.present) {
  //         const totalFaltas = await atendimentRepository.count({
  //           where: {
  //             athlete: { id: enrollment.athlete.id },
  //             modality: { id: modality.id },
  //             present: false,
  //             created_at: LessThanOrEqual(currentDate),
  //           },
  //         });

  //         // Inativa após 3 faltas
  //         if (totalFaltas > 2) {
  //           enrollment.active = false;
  //           await enrollmentRepository.save(enrollment);

  //           console.log(
  //             `  █ Atleta ${enrollment.athlete.name} INATIVADO por ${totalFaltas} faltas`
  //           );
  //         }
  //       }
  //     }
  //   }

  //   // Contabiliza total de registros
  //   const totalAtendimentos = await atendimentRepository.count({
  //     where: { modality: { id: modality.id } },
  //   });

  //   console.log(`✅ ${modality.name}: ${totalAtendimentos} registros criados`);
  // }
};
