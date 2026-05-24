import { Router } from 'express';
import { BannerController } from '../controllers/BannerController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', BannerController.getAll);
router.post('/', authMiddleware, adminMiddleware, BannerController.create);
router.put('/:id', authMiddleware, adminMiddleware, BannerController.update);
router.delete('/:id', authMiddleware, adminMiddleware, BannerController.delete);

export default router;
