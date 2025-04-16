import { AppDataSource } from "./database/config";
import app from "./app";
import dotenv from "dotenv";
import { initializeDatabase } from "./database/config";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log(`Iniciando servidor na porta ${PORT}...`);
        
        // Inicializar o banco de dados
        await initializeDatabase();
        console.log("Database initialized successfully");

        // Middleware para CORS
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header('Access-Control-Allow-Credentials', 'true');
            
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });

        // Iniciar o servidor
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api/v1`);
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