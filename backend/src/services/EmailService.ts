import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static async getTransporter() {
    if (this.transporter) return this.transporter;

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Usa SMTP configurado no .env
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Cria conta de teste no Ethereal
      console.log('Criando conta de teste Ethereal para e-mails...');
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    return this.transporter;
  }

  static async sendPaymentPendingEmail(to: string, pixData: any) {
    const transporter = await this.getTransporter();

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #E9C176; text-align: center;">Old King Cosméticos</h2>
        <h3 style="text-align: center;">Falta pouco para confirmar seu pedido!</h3>
        <p>Recebemos o seu pedido. Para prosseguir com o envio, precisamos que você finalize o pagamento via PIX.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <img src="data:image/jpeg;base64,${pixData.qr_code_base64}" alt="QR Code" style="width: 200px; height: 200px; border: 1px solid #ccc; padding: 10px; border-radius: 8px;" />
        </div>

        <p>Ou se preferir, use a chave Copia e Cola abaixo:</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; word-break: break-all; font-family: monospace;">
          <strong>${pixData.qr_code}</strong>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          Se você já realizou o pagamento, pode desconsiderar este e-mail.
        </p>
      </div>
    `;

    try {
      const info = await transporter.sendMail({
        from: '"Old King Cosméticos" <oldkingcosmeticos@gmail.com>',
        to,
        subject: 'Aguardando Pagamento do seu Pedido - Old King',
        html,
      });

      console.log('E-mail enviado: %s', info.messageId);
      if (!process.env.SMTP_USER) {
        console.log('VER E-MAIL DE TESTE (URL): %s', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail PIX:', error);
    }
  }

  static async sendPaymentApprovedEmail(to: string, orderId: string) {
    const transporter = await this.getTransporter();

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #E9C176; text-align: center;">Old King Cosméticos</h2>
        <h3 style="text-align: center; color: #4CAF50;">Pagamento Confirmado!</h3>
        <p>Temos ótimas notícias! O pagamento do seu pedido (ID: ${orderId}) foi aprovado.</p>
        <p>Nossa equipe já está separando os seus produtos. Em breve você receberá a Nota Fiscal e o código de rastreamento.</p>
        <br/>
        <p style="text-align: center; font-weight: bold;">Obrigado por escolher a Old King!</p>
      </div>
    `;

    try {
      const info = await transporter.sendMail({
        from: '"Old King Cosméticos" <oldkingcosmeticos@gmail.com>',
        to,
        subject: 'Pagamento Aprovado! - Old King',
        html,
      });

      console.log('E-mail enviado: %s', info.messageId);
      if (!process.env.SMTP_USER) {
        console.log('VER E-MAIL DE TESTE (URL): %s', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail de confirmação:', error);
      throw error;
    }
  }

  static async sendVerificationCodeEmail(to: string, code: string) {
    const transporter = await this.getTransporter();

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #E9C176; text-align: center;">Old King Cosméticos</h2>
        <h3 style="text-align: center;">Verificação de Conta</h3>
        <p style="text-align: center;">Falta apenas um passo para finalizar a criação da sua conta. Utilize o código de 6 dígitos abaixo:</p>
        
        <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <strong style="font-size: 32px; letter-spacing: 10px; color: #111;">${code}</strong>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          Se você não solicitou este código, por favor ignore este e-mail.
        </p>
      </div>
    `;

    try {
      const info = await transporter.sendMail({
        from: '"Old King Cosméticos" <oldkingcosmeticos@gmail.com>',
        to,
        subject: 'Código de Verificação - Old King',
        html,
      });

      console.log('E-mail de verificação enviado: %s', info.messageId);
      if (!process.env.SMTP_USER) {
        console.log('VER E-MAIL DE TESTE (URL): %s', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail de verificação:', error);
    }
  }
}
