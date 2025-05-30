import { athleteRouter, managerRouter, materialRouter, modalityRouter, teacherRouter, authRouter, enrollmentRouter, absencesRouter, registerRouter, authMiddlewareRouter, athleteUserBaseRouter, validations,  } from "./routes";
import { existsSync, unlinkSync } from "fs";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

//configuração apenas para o ambiente de desenvolvimento
const dbFile = "db.sqlite";
if (existsSync(dbFile)) unlinkSync(dbFile);

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', //definindo a porta que o front esta rodando pq o cors estava nao permitindo por conta da proteção de rota
    credentials: true                
  }));
  
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use("/api/material/", materialRouter);
app.use("/api/athletes/", athleteRouter);
app.use("/api/userbase/", athleteUserBaseRouter);
app.use("/api/manager/", managerRouter);
app.use("/api/teacher/", teacherRouter);
app.use("/api/modality/", modalityRouter);
app.use("/api/auth/", authRouter);
app.use("/api/enrollment/", enrollmentRouter);
app.use("/api/absences/", absencesRouter);
app.use("/api/register/", registerRouter);
app.use("/api/protect/", authMiddlewareRouter);
app.use('/api/athletes', athleteRouter)
app.use('/api/validation', validations)


export default app;