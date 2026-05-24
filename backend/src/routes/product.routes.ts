import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Rota pública para listar produtos
router.get('/', ProductController.getAll);

// Rotas protegidas (apenas ADMIN pode gerenciar produtos)
router.post('/', authMiddleware, adminMiddleware, ProductController.create);
router.put('/:id', authMiddleware, adminMiddleware, ProductController.update);
router.delete('/:id', authMiddleware, adminMiddleware, ProductController.delete);

export default router;
