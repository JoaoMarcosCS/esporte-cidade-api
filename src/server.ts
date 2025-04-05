import { AppDataSource } from "./database/config";
import app from "./app";
import dotenv from "dotenv";
import { initializeDatabase } from "./database/config";

dotenv.config();

const PORT = process.env.PORT || 5173;

async function startServer() {
    try {
        // Inicializar o banco de dados
        await initializeDatabase();
        console.log("Database initialized successfully");

        // Configurar CORS
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            next();
        });

        // Iniciar o servidor
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Adicionar tratamento de encerramento
        process.on('SIGINT', () => {
            console.log('Encerrando servidor...');
            server.close(() => {
                console.log('Servidor encerrado');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();