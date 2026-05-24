import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', ReviewController.getAll);
router.post('/', ReviewController.create);
router.delete('/:id', authMiddleware, adminMiddleware, ReviewController.delete);

export default router;
