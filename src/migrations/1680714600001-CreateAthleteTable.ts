import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAthleteTable1680714600001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if table exists before creating
        const tableExists = await queryRunner.hasTable("athlete");
        if (!tableExists) {
            await queryRunner.createTable(
                new Table({
                    name: "athlete",
                    columns: [
                        {
                            name: "id",
                            type: "integer",
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: "increment"
                        },
                        {
                            name: "name",
                            type: "text"
                        },
                        {
                            name: "password",
                            type: "text"
                        },
                        {
                            name: "cpf",
                            type: "text",
                            length: "11",
                            isUnique: false
                        },
                        {
                            name: "rg",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "birthday",
                            type: "text"
                        },
                        {
                            name: "phone",
                            type: "text"
                        },
                        {
                            name: "photo_url",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "email",
                            type: "text",
                            isUnique: true,
                            isNullable: true
                        },
                        {
                            name: "role",
                            type: "integer"
                        },
                        {
                            name: "father_name",
                            type: "text",
                            isNullable: true,
                            default: "'Nenhum nome informado'"
                        },
                        {
                            name: "father_phone",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "father_cpf",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "father_email",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "mother_name",
                            type: "text",
                            isNullable: true,
                            default: "'Nenhum nome informado'"
                        },
                        {
                            name: "mother_phone",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "mother_cpf",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "mother_email",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "responsible_person_name",
                            type: "text",
                            isNullable: true,
                            default: "'Nenhum responsável informado'"
                        },
                        {
                            name: "responsible_person_email",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "responsible_person_cpf",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "blood_type",
                            type: "text",
                            isNullable: true,
                            default: "'Nenhum tipo sanguíneo informado'"
                        },
                        {
                            name: "photo_url_cpf_front",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "photo_url_cpf_back",
                            type: "text",
                            isNullable: true
                        },
                        {
                            name: "allergy",
                            type: "text",
                            isNullable: true,
                            default: "'Nenhuma alergia informada'"
                        },
                        {
                            name: "created_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP"
                        },
                        {
                            name: "updated_at",
                            type: "timestamp",
                            default: "CURRENT_TIMESTAMP",
                            onUpdate: "CURRENT_TIMESTAMP"
                        }
                    ]
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("athlete");
    }
}
