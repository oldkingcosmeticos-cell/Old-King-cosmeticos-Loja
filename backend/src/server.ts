import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import paymentRoutes from './routes/payment.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import bannerRoutes from './routes/banner.routes';
import settingsRoutes from './routes/settings.routes';
import reviewRoutes from './routes/review.routes';
import orderRoutes from './routes/order.routes';
import shippingRoutes from './routes/shipping.routes';

// Rotas estáticas
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas da API
app.use('/api', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shipping', shippingRoutes);

const PORT = process.env.PORT || 3001;

app.get('/ping', (req, res) => res.status(200).send('pong'));

import { EmailService } from './services/EmailService';

app.get('/api/test-email', async (req, res) => {
  try {
    const to = String(req.query.to || process.env.SMTP_USER || 'contato@oldkingcosmeticos.com.br');
    await EmailService.sendPaymentApprovedEmail(to, 'TESTE-12345');
    res.status(200).json({ 
      success: true, 
      message: `E-mail de teste enviado para ${to} com sucesso! Verifique a caixa de entrada/spam.`,
      credentials_used: process.env.SMTP_USER || 'Nenhuma (Ethereal test)'
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao tentar enviar o e-mail. Verifique sua senha de APP.',
      error: err.message,
      stack: err.stack
    });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
  
  // Sistema anti-dormir: dá um "cutucão" no próprio servidor a cada 10 minutos (Render dorme em 15m)
  const RENDER_URL = 'https://old-king-cosmeticos-loja.onrender.com';
  setInterval(() => {
    fetch(`${RENDER_URL}/ping`)
      .then(res => console.log('[SISTEMA ANTI-DORMIR] Ping executado com sucesso:', res.status))
      .catch(err => console.error('[SISTEMA ANTI-DORMIR] Ping falhou (ignorando):', err.message));
  }, 10 * 60 * 1000); // 10 minutos
});
