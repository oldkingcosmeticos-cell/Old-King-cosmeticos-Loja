import { MercadoPagoConfig, Payment } from 'mercadopago';

export class MercadoPagoService {
  
  static async createPayment(paymentData: any) {
    console.log("------------------------------------------");
    console.log("[MERCADO PAGO] Processando pagamento...");
    
    try {
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
      const payment = new Payment(client);
      
      const response = await payment.create({
        body: paymentData
      });
      
      console.log("[MERCADO PAGO] Sucesso! Pagamento criado:", response.id);
      console.log("------------------------------------------");
      return response;
    } catch (error) {
      console.error("[MERCADO PAGO] Erro ao criar pagamento:", error);
      throw error;
    }
  }

}
