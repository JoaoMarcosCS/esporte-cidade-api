import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate} from "../middlewares/middleware-auth";

const router = express.Router();

router.post('/login', (req, res) => AuthController.login(req, res));

router.post('/logout', (req, res) => AuthController.logout(req, res));

router.post("/confirm-password", authenticate, AuthController.confirmPassword);
export default router;