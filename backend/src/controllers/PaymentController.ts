import { Request, Response } from 'express';
import { MercadoPagoService } from '../services/MercadoPagoService';
import { OmieService } from '../services/OmieService';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/EmailService';

const prisma = new PrismaClient();

export class PaymentController {
  
  async processCheckout(req: Request, res: Response) {
    try {
      const { items, customer, ...paymentData } = req.body;
      
      // Chama o serviço do Mercado Pago passando os dados gerados pelo Payment Brick
      const paymentResponse = await MercadoPagoService.createPayment(paymentData);
      
      // Simulando a persistência do pedido com os itens e o cliente para a emissão futura da NF
      // Aqui você poderia salvar no banco de dados o pedido vinculado ao ID do pagamento: paymentResponse.id
      
      // Envia o e-mail com o QR Code se for PIX
      if (paymentResponse.payment_method_id === 'pix' && customer?.email) {
        // Envia de forma assíncrona para não travar a resposta da API
        EmailService.sendPaymentPendingEmail(customer.email, paymentResponse.point_of_interaction?.transaction_data).catch(console.error);
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Pagamento processado com sucesso', 
        paymentResponse 
      });
    } catch (error) {
      console.error('Erro no checkout:', error);
      res.status(500).json({ success: false, message: 'Erro interno no servidor ao processar pagamento' });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const { paymentId, status } = req.body; // Simulando a notificação do Mercado Pago

      console.log(`Webhook recebido: Pagamento ${paymentId} está ${status}`);

      if (status === 'approved') {
        // Busca o pedido real no banco de dados para enviar pra Omie
        const order = await prisma.order.findFirst({
          where: { paymentId: String(paymentId) }
        });

        if (order) {
          try {
            const customerData = order.address ? JSON.parse(order.address as string) : {};
            const itemsData = order.items ? JSON.parse(order.items as string) : [];
            
            // Chama a Omie para gerar o Pedido de Venda
            await OmieService.registerOrder(order, customerData, itemsData);
            await OmieService.issueInvoice(order);
          } catch (e) {
            console.error("Erro ao integrar com a Omie no webhook:", e);
          }

          // Atualiza status do pedido no banco de dados
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'approved' }
          });

          // Dispara e-mail de confirmação
          const mockCustomerEmail = order.userId || 'cliente.teste@exemplo.com';
          await EmailService.sendPaymentApprovedEmail(mockCustomerEmail, paymentId);
        } else {
          console.warn(`Pedido com paymentId ${paymentId} não encontrado no banco.`);
        }
      }

      res.status(200).send('Webhook processado');
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).send('Erro interno');
    }
  }
}
