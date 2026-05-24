import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';

const router = Router();
const paymentController = new PaymentController();

// Rota simulando o checkout (criação do pedido de pagamento via frontend)
router.post('/checkout', paymentController.processCheckout);

// Rota simulando o webhook do Mercado Pago (aviso de pagamento aprovado para o sistema)
router.post('/webhook', paymentController.handleWebhook);

export default router;
