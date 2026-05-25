import { MercadoPagoConfig, Payment } from 'mercadopago';

export class MercadoPagoService {
  
  static async createPayment(paymentData: any) {
    console.log("------------------------------------------");
    console.log("[MERCADO PAGO] Processando pagamento...");
    
    try {
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
      const payment = new Payment(client);
      
      // Injeta a URL de webhook para a produção (Render)
      const webhookUrl = process.env.VITE_API_URL ? `${process.env.VITE_API_URL}/api/payments/webhook` : 'https://oldking-backend.onrender.com/api/payments/webhook';
      
      const bodyWithWebhook = {
        ...paymentData,
        notification_url: webhookUrl
      };

      const response = await payment.create({
        body: bodyWithWebhook
      });
      
      console.log("[MERCADO PAGO] Sucesso! Pagamento criado:", response.id);
      console.log("------------------------------------------");
      return response;
    } catch (error) {
      console.error("[MERCADO PAGO] Erro ao criar pagamento:", error);
      throw error;
    }
  }

  static async getPayment(paymentId: string | number) {
    try {
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
      const payment = new Payment(client);
      const response = await payment.get({ id: String(paymentId) });
      return response;
    } catch (error) {
      console.error("[MERCADO PAGO] Erro ao buscar pagamento:", error);
      throw error;
    }
  }

}
