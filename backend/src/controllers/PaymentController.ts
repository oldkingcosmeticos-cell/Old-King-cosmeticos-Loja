import { Request, Response } from 'express';
import { MercadoPagoService } from '../services/MercadoPagoService';
import { OmieService } from '../services/OmieService';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../services/EmailService';

const prisma = new PrismaClient();

export class PaymentController {
  
  async processCheckout(req: Request, res: Response) {
    try {
      const { items, customer, userId, ...paymentData } = req.body;
      
      // O Mercado Pago exige endereço completo para gerar boletos registrados.
      // Porém, para cartões de crédito (que enviam 'token') isso pode causar falhas na API.
      const isCard = !!paymentData.token;
      const isPix = paymentData.payment_method_id === 'pix';
      if (paymentData.payer) {
        // Altera o e-mail para impedir o Mercado Pago de enviar e-mails nativos ao cliente
        paymentData.payer.email = 'noreply@oldkingcosmeticos.com.br';
      }

      if (!isCard && !isPix && customer && paymentData.payer) {
        paymentData.payer.address = {
          zip_code: customer.cep ? customer.cep.replace(/\D/g, '') : '',
          street_name: customer.street || 'Não informado',
          street_number: customer.number || 'S/N',
          neighborhood: customer.neighborhood || 'Não informado',
          city: customer.city || 'Não informado',
          federal_unit: customer.state || 'SP'
        };
      }
      
      // Chama o serviço do Mercado Pago passando os dados gerados pelo Payment Brick
      const paymentResponse = await MercadoPagoService.createPayment(paymentData);
      
      // Persistência do pedido com os itens e o cliente para a emissão futura da NF
      let totalAmount = 0;
      if (items && items.length > 0) {
        totalAmount = items.reduce((acc: number, item: any) => {
          let price = item.unit_price;
          if (typeof price === 'string') {
            price = Number(price.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));
          }
          if (isNaN(price)) price = 0;
          return acc + (price * item.quantity);
        }, 0);
      } else if (paymentData.transaction_amount) {
        totalAmount = paymentData.transaction_amount;
      }

      let orderStatus = 'pending';
      if (paymentResponse.status === 'approved') {
        orderStatus = 'approved';
      } else if (paymentResponse.status === 'in_process') {
        orderStatus = 'in_process';
      }

      const order = await prisma.order.create({
        data: {
          userId: userId || customer?.email || 'guest',
          status: orderStatus,
          totalAmount: totalAmount,
          paymentMethod: paymentResponse.payment_method_id || 'pix',
          paymentId: String(paymentResponse.id),
          items: JSON.stringify(items || []),
          address: JSON.stringify(customer || {})
        }
      });
      
      const realEmail = customer?.email || userId;

      if (orderStatus === 'approved') {
        // Envia para Omie imediatamente
        try {
          await OmieService.registerOrder(order, customer || {}, items || []);
          await OmieService.issueInvoice(order);
        } catch (e) {
          console.error("Erro Omie checkout imediato:", e);
        }
        if (realEmail) EmailService.sendPaymentApprovedEmail(realEmail, order.id).catch(console.error);
      } else {
        // Manda e-mail de aguardando pagamento
        if (realEmail) {
          if (paymentResponse.payment_method_id === 'pix') {
            EmailService.sendPaymentPendingEmail(realEmail, paymentResponse.point_of_interaction?.transaction_data).catch(console.error);
          } else {
            // Pode ser um boleto ou cartão em análise. Se quiser enviar e-mail genérico de pendente, pode ser aqui.
            // Para boleto, TicketData tem a URL.
          }
        }
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Pagamento processado com sucesso', 
        paymentResponse 
      });
    } catch (error: any) {
      console.error('Erro no checkout:', error);
      res.status(500).json({ success: false, message: error?.message || 'Erro desconhecido ao processar pagamento' });
    }
  }

  async checkStatus(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const order = await prisma.order.findFirst({
        where: { paymentId: String(paymentId) }
      });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
      }
      return res.status(200).json({ success: true, status: order.status });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erro ao verificar status' });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      // O webhook do Mercado Pago manda action, type e data.id
      const paymentId = req.body?.data?.id || req.body?.paymentId;
      const type = req.body?.type;

      if (!paymentId || (type && type !== 'payment')) {
        return res.status(200).send('Ignorado');
      }

      console.log(`Webhook recebido: Checando pagamento ${paymentId} no Mercado Pago...`);

      // Consulta o Mercado Pago para saber o status real
      const paymentData = await MercadoPagoService.getPayment(paymentId);
      const status = paymentData.status;

      console.log(`Status real do pagamento ${paymentId}: ${status}`);

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

  async testWebhook(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      console.log(`[TESTE] Simulando aprovação do pagamento ${paymentId}`);

      const order = await prisma.order.findFirst({
        where: { paymentId: String(paymentId) }
      });

      if (order) {
        let omieLogs = "";
        try {
          const customerData = order.address ? JSON.parse(order.address as string) : {};
          const itemsData = order.items ? JSON.parse(order.items as string) : [];
          
          await OmieService.registerOrder(order, customerData, itemsData);
          omieLogs += "Omie Venda: OK. ";
          await OmieService.issueInvoice(order);
        } catch (e: any) {
          omieLogs += "Omie Error: " + (e.message || JSON.stringify(e));
          console.error("Erro ao integrar com a Omie no webhook de teste:", e);
        }

        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'approved' }
        });

        res.status(200).json({ success: true, message: 'Webhook de teste processado!', omieLogs });
      } else {
        res.status(404).send('Pedido não encontrado no banco de dados.');
      }
    } catch (error) {
      res.status(500).send('Erro interno');
    }
  }
}
