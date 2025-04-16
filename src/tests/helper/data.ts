import { Roles } from "src/enums/roles.enum";

export const modalitiesPlaceholder = [
    {
        name: "Futebol",
        description: "Um esporte coletivo jogado com uma bola esférica.",
        days_of_week: ["Segunda-feira", "Quarta-feira", "Sexta-feira"],
        start_time: "15:00",
        end_time: "17:00",
        class_locations: ["Campo A", "Campo B"],
    },
    {
        name: "Basquete",
        description: "Um esporte jogado por duas equipes que tentam marcar pontos arremessando a bola em uma cesta.",
        days_of_week: ["Terça-feira", "Quinta-feira"],
        start_time: "16:00",
        end_time: "18:00",
        class_locations: ["Ginásio"],
    },
];

export const athletesPlaceholder = [
    {
        name: "João Silva",
        password: "securepassword123",
        cpf: "111.222.333-44",
        rg: "12.345.678-9",
        birthday: "2005-06-15",
        phone: "123456789",
        photo_url: "https://example.com/photo/joao_silva.jpg",
        email: "joao.silva@example.com",
        role: Roles.ATHLETES,

        father_name: "João Silva Sr.",
        father_phone: "123456789",
        father_cpf: "111.222.333-44",
        father_email: "joao.silva.sr@example.com",
        mother_name: "Maria Silva",
        mother_phone: "987654321",
        mother_cpf: "555.666.777-88",
        mother_email: "maria.silva@example.com",
        responsible_person_name: "Responsável Silva",
        responsible_person_email: "responsavel.silva@example.com",
        responsible_person_cpf: "999.888.777-66",
        blood_type: "O+",
        allergy: "Nenhuma",
        addresses: [],
    },
    {
        name: "Carlos Santos",
        password: "securepassword456",
        cpf: "444.555.666-77",
        rg: "87.654.321-0",
        birthday: "2007-09-23",
        phone: "111222333",
        photo_url: "https://example.com/photo/carlos_santos.jpg",
        email: "carlos.santos@example.com",
        role: Roles.ATHLETES,

        father_name: "Carlos Santos Sr.",
        father_phone: "111222333",
        father_cpf: "444.555.666-77",
        father_email: "carlos.santos.sr@example.com",
        mother_name: "Ana Santos",
        mother_phone: "222333444",
        mother_cpf: "777.888.999-00",
        mother_email: "ana.santos@example.com",
        responsible_person_name: "Responsável Santos",
        responsible_person_email: "responsavel.santos@example.com",
        responsible_person_cpf: "666.555.444-33",
        blood_type: "A-",
        allergy: "Amendoim",
        addresses: [],
    },
];

export const enrollmentsPlaceholder = [
    {
        active: true,
        aproved: true,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        active: false,
        aproved: false,
        created_at: new Date(),
        updated_at: new Date(),
    }
];
