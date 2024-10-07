import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'sqlite', 
    // host: 'localhost',
    // port: 3306,
    // username: 'root',
    // password: 'senha',
    database: 'db.sqlite',
    // url:"",
    synchronize: true,//sincroniza as alterações com o banco
    logging: true,// loga as queries do banco
    entities: ["src/entities/*{.ts,.js}"],
  });

  
AppDataSource.initialize()
.then(async () => {
  console.log('Database connected');
  
  AppDataSource.entityMetadatas.forEach(metadata => {
    console.log(`Load: Entity: ${metadata.name}, Table: ${metadata.tableName}`);
});
})
.catch((error) => {
  console.error('Database connection error:', error);
});
  