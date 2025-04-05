import { RequestHandler, Router } from 'express';

export type ExpressRouter = Router;

export type ExpressHandler = RequestHandler;

export type ExpressRouterHandler = ExpressHandler & {
    path: string;
    method: string;
};
