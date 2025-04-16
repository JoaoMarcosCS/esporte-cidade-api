import { Request, Response, NextFunction } from 'express';

export interface BaseRoute {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
}

export interface BaseRouter {
    prefix?: string;
    routes: BaseRoute[];
}
