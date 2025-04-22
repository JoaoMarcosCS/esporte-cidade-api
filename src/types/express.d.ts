import { Teacher } from "../entities/teacher.entity";
import { Athlete } from "../entities/athlete.entity";
import { Manager } from "../entities/manager.entity";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name?: string; // Make this required if it should always exist
        role: string;
        type: "athlete" | "teacher" | "manager";
      };
      accessToken?: string;
    }
  }
}

export interface ExpressRequest extends Request {
  athlete?: Athlete;
  teacher?: Teacher;
  manager?: Manager;
  accessToken?: string;
}
