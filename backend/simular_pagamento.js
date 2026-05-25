const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function simulateWebhook() {
  console.log('Buscando último pedido pendente no banco de dados...');
  const order = await prisma.order.findFirst({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' }
  });

  if (!order) {
    console.log('Nenhum pedido pendente encontrado para testar.');
    return;
  }

  console.log(`Encontrado pedido ID: ${order.id}`);
  console.log(`Payment ID do Mercado Pago: ${order.paymentId}`);
  console.log('Enviando simulação de Webhook para o Render...');

  const url = `https://old-king-cosmeticos-loja.onrender.com/api/test-webhook/${order.paymentId}`;
  
  try {
    const res = await fetch(url, { method: 'POST' });
    const text = await res.text();
    console.log(`Resposta do Servidor Render: ${text}`);
    if (res.ok) {
      console.log('SUCESSO! O pedido foi forçado para APROVADO e enviado para a Omie!');
    }
  } catch (error) {
    console.error('Erro ao conectar com o Render:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simulateWebhook();
