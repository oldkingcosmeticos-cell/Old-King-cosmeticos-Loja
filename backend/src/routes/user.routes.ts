import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Apenas administradores podem ver todos os usuários
router.get('/', authMiddleware, adminMiddleware, UserController.getAllUsers);

// Apenas administradores podem promover ou rebaixar outros administradores
router.put('/:id/role', authMiddleware, adminMiddleware, UserController.toggleAdmin);

export default router;
