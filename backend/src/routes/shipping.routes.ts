import { Router } from 'express';
import { ShippingController } from '../controllers/ShippingController';

const router = Router();

router.post('/calculate', ShippingController.calculate);

export default router;
