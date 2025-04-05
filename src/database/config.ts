import { DataSource } from 'typeorm';
import 'reflect-metadata';
import env from "../environment/env";
import { join } from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: join(__dirname, '..', env.NODE_ENV === 'test' ? 'db.test.sqlite' : 'db.sqlite'),
  synchronize: true,
  logging: false,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
  dropSchema: env.NODE_ENV === 'test'
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
