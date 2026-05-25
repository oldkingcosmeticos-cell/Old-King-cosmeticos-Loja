import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderController {
  static async getAll(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.json(orders);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  }

  static async getMyOrders(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.email) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const orders = await prisma.order.findMany({
        where: { userId: user.email },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(orders);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar seus pedidos' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { userId, totalAmount, status, paymentMethod, paymentId, items, shippingFee, address } = req.body;
      const newOrder = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          status,
          paymentMethod,
          paymentId,
          items: JSON.stringify(items || []),
          shippingFee: shippingFee || 0,
          address: address ? JSON.stringify(address) : null
        }
      });
      return res.status(201).json(newOrder);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  }
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status }
      });
      return res.json(updatedOrder);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.order.delete({ where: { id } });
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao excluir pedido' });
    }
  }

  static async checkPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const order = await prisma.order.findFirst({
        where: { paymentId }
      });
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      return res.json({ status: order.status });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao checar status do pagamento' });
    }
  }
}
