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

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar rotas
app.use("/api/v1", routes);

export default app;