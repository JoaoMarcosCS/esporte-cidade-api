import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { authConfig } from '../config/auth';

declare global {
  namespace Express {
    interface Request {
      user?: { 
        id: number;
        role: string;
        type: 'athlete' | 'teacher' | 'manager';
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "Token não fornecido" });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = verify(token, authConfig.accessToken.secret) as {
      id: number;
      role: string;
      type: string;
    };

    switch (decoded.type) {
      case 'athlete':
        req.user = { id: decoded.id, role: decoded.role, type: 'athlete' };
        break;
      case 'manager':
        req.user = { id: decoded.id, role: decoded.role, type: 'manager' };
        break;
      case 'teacher':
        req.user = { id: decoded.id, role: decoded.role, type: 'teacher' };
        break;
      default:
        res.status(401).json({ message: "Tipo de usuário inválido" });
        return;
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
};
