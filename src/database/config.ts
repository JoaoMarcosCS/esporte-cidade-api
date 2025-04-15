import { DataSource } from 'typeorm';
import 'reflect-metadata';
import env from "../environment/env";

export const AppDataSource = new DataSource({
  type: 'sqlite',
  // host: 'localhost',
  // port: 3306,
  // username: 'root',
  // password: 'senha',
  database: env.NODE_ENV ? 'db.test.sqlite' : 'db.sqlite',
  // url:"",
  synchronize: true, //sincroniza as alterações com o banco
  logging: false, // loga as queries do banco
  entities: ["src/entities/*{.ts,.js}"],
});

AppDataSource.initialize()
  .then(async () => {
    AppDataSource.entityMetadatas.forEach(metadata => {
      // console.log(`Load: Entity: ${metadata.name}, Table: ${metadata.tableName}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
