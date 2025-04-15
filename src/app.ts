import { athleteRouter, managerRouter, materialRouter, modalityRouter, teacherRouter, authRouter, enrollmentRouter, registerRouter } from "./routes";
import { existsSync, unlinkSync } from "fs";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

//configuração apenas para o ambiente de desenvolvimento
const dbFile = "db.sqlite";
if (existsSync(dbFile)) unlinkSync(dbFile);

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/material/", materialRouter);
app.use("/api/userbase/", athleteRouter);
app.use("/api/manager/", managerRouter);
app.use("/api/teacher/", teacherRouter);
app.use("/api/modality/", modalityRouter);
app.use("/api/auth/", authRouter);
app.use("/api/enrollment/", enrollmentRouter);
app.use("/api/register",registerRouter);

export default app;