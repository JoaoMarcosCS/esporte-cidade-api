import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserBaseTable1680714600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if table exists before creating
        const tableExists = await queryRunner.hasTable("user-base");
        if (!tableExists) {
            await queryRunner.createTable(
                new Table({
                    name: "user-base",
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
        await queryRunner.dropTable("user-base");
    }
}
