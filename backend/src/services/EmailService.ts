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
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #131313; color: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #333;">
        <div style="background-color: #000; padding: 30px; text-align: center; border-bottom: 2px solid #E9C176;">
          <h1 style="color: #E9C176; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">Old King</h1>
          <p style="color: #888; margin-top: 5px; font-size: 14px;">Cosméticos</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #E9C176; color: #000; width: 60px; height: 60px; border-radius: 50%; display: inline-block; line-height: 60px; font-size: 30px; font-weight: bold;">✓</div>
            <h2 style="color: #E9C176; margin-top: 20px; font-size: 24px;">PAGAMENTO APROVADO!</h2>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #ddd;">Temos ótimas notícias! O pagamento do seu pedido <strong>#${orderId}</strong> foi processado e aprovado com sucesso.</p>
          
          <div style="background-color: #1f1f1f; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #E9C176;">
            <p style="margin: 0; font-size: 15px; color: #ccc;"><strong>O que acontece agora?</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #aaa; line-height: 1.5;">Nossa equipe já está separando os seus produtos com todo o cuidado. A sua <strong>Nota Fiscal</strong> está sendo gerada pelo nosso sistema e você receberá ela em um e-mail separado muito em breve, junto com o código de rastreio!</p>
          </div>
          
          <p style="font-size: 15px; text-align: center; margin-top: 40px; color: #888;">Obrigado por escolher a excelência da Old King.</p>
        </div>
        
        <div style="background-color: #0a0a0a; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          © ${new Date().getFullYear()} Old King Cosméticos. Todos os direitos reservados.
        </div>
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
