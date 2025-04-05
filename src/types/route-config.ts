import { Request, Response } from 'express';

export interface RouteConfig {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    handler: (req: Request, res: Response) => Promise<void> | void;
}

export interface RouterConfig {
    prefix?: string;
    routes: RouteConfig[];
}

export const configureRouter = (app: express.Application, config: RouterConfig) => {
    const { prefix = '', routes } = config;
    
    routes.forEach(route => {
        const fullPath = prefix + route.path;
        
        switch (route.method) {
            case 'get':
                app.get(fullPath, route.handler);
                break;
            case 'post':
                app.post(fullPath, route.handler);
                break;
            case 'put':
                app.put(fullPath, route.handler);
                break;
            case 'delete':
                app.delete(fullPath, route.handler);
                break;
        }
    });
};
