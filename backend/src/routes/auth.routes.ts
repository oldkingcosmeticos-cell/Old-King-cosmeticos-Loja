import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Rota para disparar o e-mail de código de verificação
router.post('/send-code', AuthController.sendVerificationCode);

// Rota para criar o usuário real no Banco de Dados
router.post('/register', AuthController.register);

// Rota para fazer o login real
router.post('/login', AuthController.login);

// Rota para login com o Google
router.post('/google', AuthController.googleLogin);

export default router;
