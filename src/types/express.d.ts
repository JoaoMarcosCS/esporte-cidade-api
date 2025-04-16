import { Request, Response, NextFunction } from 'express';

export interface AthleteAuth {
    id: number;
    cpf: string;
    role: number;
}

export interface Manager {
    id: number;
    email: string;
    role: number;
}

declare global {
    namespace Express {
        interface Request {
            athlete?: AthleteAuth;
            manager?: Manager;
        }
    }
}

export interface ExpressRequest extends Request {
    athlete?: AthleteAuth;
    manager?: Manager;
    accessToken?: string;
}

export type ExpressResponse = Response;

export type ExpressNextFunction = NextFunction;
