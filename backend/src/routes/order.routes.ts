import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/my-orders', authMiddleware, OrderController.getMyOrders);
router.get('/', OrderController.getAll);
router.post('/', OrderController.create);
router.put('/:id', OrderController.update);
router.delete('/:id', OrderController.delete);

export default router;
