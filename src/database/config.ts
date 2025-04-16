import { DataSource } from 'typeorm';
import 'reflect-metadata';
import env from "../environment/env";
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: join(__dirname, '..', env.NODE_ENV === 'test' ? 'db.test.sqlite' : 'db.sqlite'),
  synchronize: false,
  logging: false,
  dropSchema: false, // !USAR SOMENTE EM DESENVOLVIMENTO: deleta todas as tabelas para sincronizar o banco,
  entities: [join(__dirname, "..", "entities", "*.{ts,js}")],
  migrations: [join(__dirname, "..", "migrations", "*.{ts,js}")],
  subscribers: [join(__dirname, "..", "subscribers", "*.{ts,js}")],
});

export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('Database initialized successfully');
        
        // Run migrations after initialization
        await AppDataSource.runMigrations();
        console.log('Migrations completed successfully');
    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
}
