import { Router } from 'express';
import { SettingsController } from '../controllers/SettingsController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', SettingsController.get);
router.put('/', authMiddleware, adminMiddleware, SettingsController.update);

export default router;
