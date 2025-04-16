import express from "express";
import { existsSync, unlinkSync } from "fs";
import * as dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";

dotenv.config();

//configuração apenas para o ambiente de desenvolvimento
const dbFile = "db.sqlite";
if (existsSync(dbFile)) unlinkSync(dbFile);

const app = express();

// Configurar CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Configurar middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar rotas
app.use("/api/v1", routes);

// Middleware de log
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

export default app;